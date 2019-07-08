# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Related records API."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.errors import RelatedRecordError


def record_to_relation_dump(record, relation):
    """Convert a record to a relation dump."""
    return dict(
        pid=record[record.pid_field],
        pid_type=record._pid_type,
        relation_type=relation.name
    )


def get_node(record, relation):
    """Get node for a record with a relation."""
    PIDNodeClass = obj_or_import_string(relation.api)
    return PIDNodeClass(pid=record.pid, relation_type=relation)


class RelatedRecords(object):
    """Manage related records."""

    def __init__(self, parent):
        """Initialize related records proxy.

        :param parent: Parent record
        """
        self.parent = parent
        self.changed_related_records = []

    @property
    def editions(self):
        """Get related editions."""
        return self.get_related(RelatedRecords.edition_relation())

    @property
    def languages(self):
        """Get related languages."""
        return self.get_related(RelatedRecords.language_relation())

    def add_edition(self, record):
        """Add a new related edition."""
        self.add(record, RelatedRecords.edition_relation())

    def add_language(self, record):
        """Add a new related language."""
        self.add(record, RelatedRecords.language_relation())

    def add(self, record, relation):
        """Add a new related record."""
        self._add_record(
            record,
            relation,
            parent_node=self._parent_node(relation)
        )

    def _add_record(self, record, relation, parent_node=None):
        """Add related record."""
        if record == self.parent:
            raise RelatedRecordError(
                "Cannot add itself ({} #{}) as a related {}.".format(
                    record.__class__.__name__,
                    record[record.pid_field],
                    relation.name
                )
            )
        record_node = get_node(record, relation)
        if record_node.is_parent or record_node.is_child:
            raise RelatedRecordError(
                ("Failed to add {} #{} as a related {} to {} #{} because it "
                 "already has relations.").format(
                    record.__class__.__name__,
                    record[record.pid_field],
                    relation.name,
                    self.parent.__class__.__name__,
                    self.parent[self.parent.pid_field]
                 )
            )
        if parent_node is None:
            parent_node = get_node(self.parent, relation)
        self.dump_add(self.parent, record, relation, update_related=True)
        parent_node.insert_child(record.pid)

    def remove_edition(self, record):
        """Remove related edition."""
        self.remove(record, RelatedRecords.edition_relation())

    def remove_language(self, record):
        """Remove related language."""
        self.remove(record, RelatedRecords.language_relation())

    def remove(self, record, relation):
        """Remove existing related record."""
        self._remove_record(
            record,
            relation,
            parent_node=self._parent_node(relation)
        )

    def _remove_record(self, child, relation, parent_node=None):
        """Remove related record with a relation."""
        if parent_node is None:
            parent_node = get_node(self.parent, relation)
        parent_pid = parent_node.pid
        parent = self.parent
        is_parent_equal = parent_pid.pid_value == child[child.pid_field] and \
            parent_pid.pid_type == child._pid_type
        if is_parent_equal:
            # Trying to remove parent
            # TODO: remove old relations and copy over relations to self.parent
            raise RelatedRecordError(
                ("Cannot remove the {} relation from {} {}. Please remove this"
                 " relation by editing {} {}.").format(
                     relation.name,
                     self.parent.__class__.__name__,
                     self.parent[self.parent.pid_field],
                     child.__class__.__name__,
                     child[child.pid_field]
                 )
            )
        parent_node.remove_child(child.pid)
        self.dump_remove(parent, child, relation, update_related=True)

    def _parent_node(self, relation_type):
        """Get the parent node with the given relation_type."""
        node = get_node(self.parent, relation_type)
        parents = list(node.parents)
        is_child = len(parents) > 0
        if is_child:
            PIDNodeClass = obj_or_import_string(relation_type.api)
            return PIDNodeClass(pid=parents[0], relation_type=relation_type)
        return get_node(self.parent, relation_type)

    def get_related(self, relation_type):
        """Get all related records from the related records dump."""
        return [
            self.parent.get_record_by_pid(obj["pid"], pid_type=obj["pid_type"])
            for obj in self.parent["related_records"]
            if obj["relation_type"] == relation_type.name
        ]

    def _get_related_db(self, relation_type):
        """Get all related records from the DB."""
        node = self._parent_node(relation_type)
        children = [node.pid] + list(node.children)
        return [
            self.parent.get_record_by_pid(
                child.pid_value,
                pid_type=child.pid_type
            )
            for child in children
            if child.pid_value != self.parent[self.parent.pid_field]
        ]

    def dump_add(self, parent, record, relation, update_related=False):
        """Add record to related records dump."""
        obj = record_to_relation_dump(record, relation)
        related_records = parent["related_records"]
        if obj not in related_records:
            related_records.append(obj)
            self.dump_add(record, parent, relation)
            self.changed_related_records.append(record)

            if update_related:
                for related in self._get_related_db(relation):
                    self.changed_related_records.append(related)
                    self.dump_add(related, record, relation)

    def dump_remove(self, parent, record, relation, update_related=False):
        """Remove record to related records dump."""
        obj = record_to_relation_dump(record, relation)
        related_records = parent["related_records"]
        if obj in related_records:
            related_records.remove(obj)
            self.dump_remove(record, parent, relation)
            self.changed_related_records.append(record)

            if update_related:
                for related in self._get_related_db(relation):
                    self.changed_related_records.append(related)
                    self.dump_remove(related, record, relation)

    @staticmethod
    def edition_relation():
        """Get edition relation type."""
        return current_app.config["EDITION_RELATION"]

    @staticmethod
    def language_relation():
        """Get language relation type."""
        return current_app.config["LANGUAGE_RELATION"]

    @staticmethod
    def get_relation_by_name(name):
        """Get the relation_type by name."""
        for relation in current_app.config["PIDRELATIONS_RELATION_TYPES"]:
            if relation.name == name:
                return relation
        raise RelatedRecordError(
            "No relation type with name: {}".format(name)
        )

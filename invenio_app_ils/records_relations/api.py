# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs for CRUD operations around Records Relations."""
from copy import deepcopy

from flask import current_app

from invenio_app_ils.errors import RecordRelationsError
from invenio_app_ils.relations.api import ParentChildRelation, SiblingsRelation


class RecordRelationsMetadata(object):
    """Utilities to manage the `relations_metadata` field."""

    _field_name = "relations_metadata"

    @classmethod
    def field_name(cls):
        """Return field name property."""
        return cls._field_name

    @classmethod
    def build_metadata_object(cls, pid_value, pid_type, **kwargs):
        """Build and return the payload to be added to `relations_metadata`."""
        r = {"pid": pid_value, "pid_type": pid_type}
        r.update(kwargs)
        return r

    @classmethod
    def get_metadata_for(cls, record, relation_name, pid, pid_type):
        """Return the `relations_metadata` dict for the given PID and type."""
        metadata = record.get(cls.field_name(), {}).get(relation_name, [])
        for m in metadata:
            if m.get("pid", "") == pid and m.get("pid_type", "") == pid_type:
                return deepcopy(m)

    @classmethod
    def add_metadata_to(
        cls, record, relation_name, pid_value, pid_type, **kwargs
    ):
        """Add a new `relations_metadata` dict for the given PID and type."""
        metadata = record.setdefault(cls.field_name(), {})
        relation_metadata = metadata.setdefault(relation_name, [])
        for m in relation_metadata:
            if (
                m.get("pid", "") == pid_value
                and m.get("pid_type", "") == pid_type
            ):
                raise RecordRelationsError(
                    "The record PID `{}` has already metadata for the relation"
                    " `{}` and record PID `{}`".format(
                        record.pid.pid_value, relation_name, pid_value
                    )
                )
        obj = RecordRelationsMetadata.build_metadata_object(
            pid_value, pid_type, **kwargs
        )
        relation_metadata.append(obj)
        record.commit()

    @classmethod
    def remove_metadata_from(cls, record, relation_name, pid_value, pid_type):
        """Remove any presence of the given PID in `relations_metadata`."""
        if (
            cls.field_name() in record
            and relation_name in record[cls.field_name()]
        ):
            # filter out the `relations_metadata` for PID
            remaining_relations = list(
                filter(
                    lambda m: not (
                        m.get("pid", "") == pid_value
                        and m.get("pid_type", "") == pid_type
                    ),
                    record[cls.field_name()][relation_name],
                )
            )

            if remaining_relations != record[cls.field_name()][relation_name]:
                # if there are no more relations of this type, remove the obj
                if not remaining_relations:
                    del record[cls.field_name()][relation_name]
                else:
                    record[cls.field_name()][relation_name] = remaining_relations

                # if there are 0 `relations_metadata` left,
                # delete `relations_metadata`
                if not record[cls.field_name()]:
                    del record[cls.field_name()]

                record.commit()


class RecordRelationsRetriever(object):
    """Retriever of relations between records."""

    def __init__(self, record):
        """Constructor."""
        self.record = record

    def _build_relations_object(self, pid_value, pid_type, **kwargs):
        """Build and return each object of `relations` field."""
        r = {"pid": pid_value, "pid_type": pid_type}
        r.update(kwargs)
        return r

    def _build_parent(self, child_pid, relation_type):
        """Return the relation object with metadata."""
        # this is a parent, relations_metadata are stored here
        pid = child_pid.pid_value
        pid_type = child_pid.pid_type

        r = RecordRelationsMetadata.build_metadata_object(pid, pid_type)

        # get `relations_metadata` field data
        metadata = RecordRelationsMetadata.get_metadata_for(
            self.record, relation_type, pid, pid_type
        )
        # merge with any `relations_metadata`
        r.update(metadata or {})
        r["relation_type"] = relation_type

        return r

    def _build_child(self, parent_pid, child_pid, relation_type):
        """Return the relation object with metadata of the parent."""
        # this is a child, relations_metadata are stored in the parent
        pid = parent_pid.pid_value
        pid_type = parent_pid.pid_type

        r = self._build_relations_object(pid, pid_type)

        # fetch the parent to retrieve any extra `relations_metadata`
        from invenio_app_ils.records.api import IlsRecord
        parent = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)

        # get `relations_metadata` field data from the parent referring to this
        # record
        metadata = RecordRelationsMetadata.get_metadata_for(
            parent, relation_type, child_pid.pid_value, child_pid.pid_type
        )
        # `relations_metadata` has pid and pid_type of the child
        # replace it with the parent ones
        if metadata and "pid" in metadata and "pid_type" in metadata:
            metadata["pid"] = pid
            metadata["pid_type"] = pid_type

        # merge with any `relations_metadata`
        r.update(metadata or {})

        # add also the title of the parent
        r["title"] = parent.get("title", "")
        r["relation_type"] = relation_type

        return r

    def _build_sibling(self, related_pid, relation_type):
        """Return the relation object with metadata."""
        pid = related_pid.pid_value
        pid_type = related_pid.pid_type

        r = self._build_relations_object(pid, pid_type)

        # fetch the sibling to retrieve any extra `relations_metadata`
        from invenio_app_ils.records.api import IlsRecord
        sibling = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)

        # get `relations_metadata` field data from the sibling referring to
        # this record
        metadata = RecordRelationsMetadata.get_metadata_for(
            self.record, relation_type, pid, pid_type
        )
        # merge with any `relations_metadata`
        r.update(metadata or {})

        # add also title, language and edition of the sibling
        r["title"] = sibling.get("title", "")
        language = sibling.get('languages')
        if language:
            r["languages"] = language
        edition = sibling.get('edition')
        if edition:
            r["edition"] = edition
        r["relation_type"] = relation_type

        return r

    def get(self):
        """Get all relations of this record, adding any relations metadata."""
        relations = {}

        for relation_type in current_app.config["PARENT_CHILD_RELATION_TYPES"]:
            pcr = ParentChildRelation(relation_type)
            name = relation_type.name

            # self.record is a child
            for parent_pid in pcr.parents_of(self.record.pid):
                child_pid = self.record.pid
                r = self._build_child(parent_pid, child_pid, name)

                relations.setdefault(name, [])
                relations[name].append(r)

        for relation_type in current_app.config["SIBLINGS_RELATION_TYPES"]:
            sr = SiblingsRelation(relation_type)
            name = relation_type.name

            for related_pid in sr.all(self.record.pid):
                r = self._build_sibling(related_pid, name)

                relations.setdefault(name, [])
                relations[name].append(r)

        return relations


class RecordRelations(object):
    """Record relations object."""

    relation_types = []

    def _validate_relation_type(self, relation_type):
        """Validate the given relation type to be one of Parent-Child."""
        if relation_type not in self.relation_types:
            rel_names = ",".join([rt.name for rt in self.relation_types])
            raise RecordRelationsError(
                "Relation type must be one of `{}`".format(rel_names)
            )

    def _validate_relation_between_records(self, rec1, rec2, relation_name):
        """Abstract method to validate relation between records."""
        raise NotImplementedError

    def add(self, rec1, rec2, relation_type, **kwargs):
        """Add a new relation between the given records."""
        raise NotImplementedError

    def remove(self, rec1, rec2, relation_type):
        """Remove an existing relation between the given records."""
        raise NotImplementedError


class RecordRelationsParentChild(RecordRelations):
    """Add/Remove operations for Parent-Child relations."""

    allowed_metadata = ["volume"]

    def __init__(self):
        """Constructor."""
        self.relation_types = current_app.config["PARENT_CHILD_RELATION_TYPES"]

    def _validate_relation_between_records(self, parent, child, relation_name):
        """Validate relation between type of records."""
        from invenio_app_ils.documents.api import Document
        from invenio_app_ils.records.api import Series

        # when child is Document, parent is any type of Series
        is_series_doc = isinstance(child, Document) and isinstance(
            parent, Series
        )
        # when child is Multipart Monograph, parent is only Serials
        is_serial_mm = (
            isinstance(child, Series)
            and isinstance(parent, Series)
            and child["mode_of_issuance"] == "MULTIPART_MONOGRAPH"
            and parent["mode_of_issuance"] == "SERIAL"
        )

        if not (is_series_doc or is_serial_mm):
            raise RecordRelationsError(
                "Cannot create a relation `{}` between PID `{}` as parent and "
                "PID `{}` as child.".format(
                    relation_name, parent.pid.pid_value, child.pid.pid_value
                )
            )
        return True

    def add(self, parent, child, relation_type, **kwargs):
        """Add a new relation between given parent and child records."""
        self._validate_relation_type(relation_type)
        self._validate_relation_between_records(
            parent=parent, child=child, relation_name=relation_type.name
        )

        pcr = ParentChildRelation(relation_type)
        pcr.add(parent_pid=parent.pid, child_pid=child.pid)

        # relation metadata is allowed only for MULTIPART_MONOGRAPH
        relation_allows_metadata = relation_type in (
            current_app.config["MULTIPART_MONOGRAPH_RELATION"],
            current_app.config["SERIAL_RELATION"],
        )
        # check for allowed relation metadata (e.g. `volume`)
        has_allowed_metadata = any(
            [kwargs.get(metadata) for metadata in self.allowed_metadata]
        )

        if relation_allows_metadata and has_allowed_metadata:
            # filter and keep only allowed metadata
            allowed = {
                k: v for k, v in kwargs.items() if k in self.allowed_metadata
            }
            # store relation metadata in the parent record
            RecordRelationsMetadata.add_metadata_to(
                parent,
                relation_type.name,
                child.pid.pid_value,
                child._pid_type,
                **allowed
            )

        # return the allegedly modified record
        return parent

    def remove(self, parent, child, relation_type):
        """Remove a relation between given parent and child records."""
        self._validate_relation_type(relation_type)
        pcr = ParentChildRelation(relation_type)
        pcr.remove(parent_pid=parent.pid, child_pid=child.pid)

        # remove any metadata for this relation, if any
        RecordRelationsMetadata.remove_metadata_from(
            parent, relation_type.name, child.pid.pid_value, child._pid_type
        )

        # return the allegedly modified record
        return parent


class RecordRelationsSiblings(RecordRelations):
    """Add/Remove operations for Siblings relations."""

    allowed_metadata = ["note"]

    def __init__(self):
        """Constructor."""
        self.relation_types = current_app.config["SIBLINGS_RELATION_TYPES"]

    def _validate_relation_between_records(self, first, second, relation_name):
        """Validate relation between type of records."""
        from invenio_app_ils.documents.api import Document
        from invenio_app_ils.records.api import Series

        # records must be of the same type
        same_document = isinstance(first, Document) and isinstance(
            second, Document
        )
        same_series = (
            isinstance(first, Series)
            and isinstance(second, Series)
            and first["mode_of_issuance"] == second["mode_of_issuance"]
        )
        valid_edition = relation_name == "edition" and (
            (
                isinstance(first, Document)
                and isinstance(second, Series)
                and second["mode_of_issuance"] == "MULTIPART_MONOGRAPH"
            ) or (
                isinstance(second, Document)
                and isinstance(first, Series)
                and first["mode_of_issuance"] == "MULTIPART_MONOGRAPH"
            )
        )

        if not (same_document or same_series or valid_edition):
            raise RecordRelationsError(
                "Cannot create a relation `{}` between PID `{}` and  PID `{}`,"
                " they are different record types".format(
                    relation_name, first.pid.pid_value, second.pid.pid_value
                )
            )
        return True

    def add(self, first, second, relation_type, **kwargs):
        """Add a new relation between given first and second records."""
        self._validate_relation_type(relation_type)
        self._validate_relation_between_records(
            first=first, second=second, relation_name=relation_type.name
        )

        sr = SiblingsRelation(relation_type)
        sr.add(first_pid=first.pid, second_pid=second.pid)

        # check for allowed relation metadata (e.g. `note`)
        has_allowed_metadata = any(
            [kwargs.get(metadata) for metadata in self.allowed_metadata]
        )

        if has_allowed_metadata:
            # filter and keep only allowed metadata
            allowed = {
                k: v for k, v in kwargs.items() if k in self.allowed_metadata
            }
            # store relation metadata in the first record
            RecordRelationsMetadata.add_metadata_to(
                first,
                relation_type.name,
                second.pid.pid_value,
                second._pid_type,
                **allowed
            )

        # return the allegedly modified record
        return first

    def remove(self, first, second, relation_type):
        """Remove the relation between the first and the second."""
        self._validate_relation_type(relation_type)
        sr = SiblingsRelation(relation_type)
        sr.remove(pid=second.pid)

        # remove any metadata for this relation, if any
        # both first and second could have metadata for the relation
        RecordRelationsMetadata.remove_metadata_from(
            first, relation_type.name, second.pid.pid_value, second._pid_type
        )
        RecordRelationsMetadata.remove_metadata_from(
            second, relation_type.name, first.pid.pid_value, first._pid_type
        )

        # return the allegedly modified record
        return first, second

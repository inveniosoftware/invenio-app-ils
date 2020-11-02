# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs for CRUD operations around Records Relations."""

from copy import deepcopy

from invenio_app_ils.errors import (RecordHasReferencesError,
                                    RecordRelationsError)
from invenio_app_ils.records.api import IlsRecord
from invenio_app_ils.relations.api import (MULTIPART_MONOGRAPH_RELATION,
                                           PARENT_CHILD_RELATION_TYPES,
                                           SEQUENCE_RELATION_TYPES,
                                           SERIAL_RELATION,
                                           SIBLINGS_RELATION_TYPES,
                                           ParentChildRelation,
                                           SequenceRelation, SiblingsRelation)


class RecordRelationsExtraMetadata(object):
    """Utilities to manage the extra metadata field."""

    _field_name = "relations_extra_metadata"

    @classmethod
    def field_name(cls):
        """Return field name property."""
        return cls._field_name

    @classmethod
    def build_metadata_object(cls, pid_value, pid_type, **kwargs):
        """Build and return the payload to be added to extra metadata field."""
        r = {"pid_value": pid_value, "pid_type": pid_type}
        r.update(kwargs)
        return r

    @classmethod
    def get_extra_metadata_from(
        cls, record, relation_name, pid_value, pid_type
    ):
        """Return the extra metadata dict for the given PID and type."""
        metadata = record.get(cls.field_name(), {}).get(relation_name, [])
        for m in metadata:
            has_same_pid = (
                m.get("pid_value", "") == pid_value
                and m.get("pid_type", "") == pid_type
            )
            if has_same_pid:
                return deepcopy(m)
        return {}

    @classmethod
    def add_extra_metadata_to(
        cls, record, relation_name, pid_value, pid_type, **kwargs
    ):
        """Add a new extra metadata dict for the given PID and type."""
        metadata = record.setdefault(cls.field_name(), {})
        relation_metadata = metadata.setdefault(relation_name, [])
        for m in relation_metadata:
            if (
                m.get("pid_value", "") == pid_value
                and m.get("pid_type", "") == pid_type
            ):
                raise RecordRelationsError(
                    "The record PID `{}` has already metadata for the relation"
                    " `{}` and record PID `{}`".format(
                        record.pid.pid_value, relation_name, pid_value
                    )
                )
        obj = RecordRelationsExtraMetadata.build_metadata_object(
            pid_value, pid_type, **kwargs
        )
        relation_metadata.append(obj)
        record.commit()

    @classmethod
    def remove_extra_metadata_from(
        cls, record, relation_name, pid_value, pid_type
    ):
        """Remove any presence of the given PID in extra metadata."""
        field = cls.field_name()
        if field in record and relation_name in record[field]:
            keep_pid_func = lambda m: not (
                m.get("pid_value", "") == pid_value
                and m.get("pid_type", "") == pid_type
            )
            remaining_relations = list(
                filter(keep_pid_func, record[field][relation_name])
            )

            if remaining_relations != record[field][relation_name]:
                # if there are no more relations of this type, remove the obj
                if not remaining_relations:
                    del record[field][relation_name]
                else:
                    record[field][relation_name] = remaining_relations

                # if there are 0 extra metadata left, delete the field
                if not record[field]:
                    del record[field]

                record.commit()


class RecordRelations(object):
    """Record relations object."""

    relation_types = []

    def _validate_relation_type(self, relation_type):
        """Validate the given relation type."""
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
        self.relation_types = PARENT_CHILD_RELATION_TYPES

    def _validate_relation_between_records(self, parent, child, relation_name):
        """Validate relation between type of records."""
        from invenio_app_ils.documents.api import Document
        from invenio_app_ils.series.api import Series

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
            MULTIPART_MONOGRAPH_RELATION,
            SERIAL_RELATION,
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
            # store relation metadata in the child record
            RecordRelationsExtraMetadata.add_extra_metadata_to(
                child,
                relation_type.name,
                parent.pid.pid_value,
                parent.pid.pid_type,
                **allowed,
            )

        # return the allegedly modified record
        return child

    def remove(self, parent, child, relation_type):
        """Remove a relation between given parent and child records."""
        self._validate_relation_type(relation_type)
        pcr = ParentChildRelation(relation_type)
        pcr.remove(parent_pid=parent.pid, child_pid=child.pid)

        # remove any metadata for this relation, if any
        RecordRelationsExtraMetadata.remove_extra_metadata_from(
            child,
            relation_type.name,
            parent.pid.pid_value,
            parent.pid.pid_type,
        )
        return child


class RecordRelationsSiblings(RecordRelations):
    """Add/Remove operations for Siblings relations."""

    allowed_metadata = ["note"]

    def __init__(self):
        """Constructor."""
        self.relation_types = SIBLINGS_RELATION_TYPES

    def _validate_relation_between_records(self, first, second, relation_name):
        """Validate relation between type of records."""
        from invenio_app_ils.documents.api import Document
        from invenio_app_ils.series.api import Series

        # records must be of the same type
        same_document = isinstance(first, Document) and isinstance(
            second, Document
        )
        same_series = (
            isinstance(first, Series)
            and isinstance(second, Series)
            and first["mode_of_issuance"] == second["mode_of_issuance"]
        )
        valid_edition_relation = relation_name == "edition" and (
            (
                isinstance(first, Document)
                and isinstance(second, Series)
                and second["mode_of_issuance"] == "MULTIPART_MONOGRAPH"
            )
            or (
                isinstance(second, Document)
                and isinstance(first, Series)
                and first["mode_of_issuance"] == "MULTIPART_MONOGRAPH"
            )
        )

        valid_edition_fields = relation_name == "edition" and \
            first.get('edition', False) and second.get('edition', False)

        valid_language_fields = relation_name == 'language' and \
            first.get('languages', False) and second.get('languages', False)

        valid_other_fields = relation_name == "other"

        equal_editions = relation_name == 'edition' and first.get('edition') \
            == second.get('edition')

        equal_languages = relation_name == 'language' and \
            first.get('languages') == second.get('languages')

        if not (same_document or same_series or valid_edition_relation):
            raise RecordRelationsError(
                "Cannot create relation `{}` between PID `{}` and  PID `{}`,"
                " they are different record types".format(
                    relation_name, first.pid.pid_value, second.pid.pid_value
                )
            )

        if not (valid_edition_fields or valid_language_fields or
                valid_other_fields):
            raise RecordRelationsError(
                "Cannot create relation `{}` "
                "between PID `{}` and  PID `{}`,"
                " one of the records is missing {} fields".format(
                    relation_name, first.pid.pid_value, second.pid.pid_value,
                    relation_name
                )
            )

        if equal_editions or equal_languages:
            raise RecordRelationsError(
                "Cannot create relation `{}` "
                "between PID `{}` and  PID `{}`,"
                " records have equal {} fields".format(
                    relation_name, first.pid.pid_value, second.pid.pid_value,
                    relation_name
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
            RecordRelationsExtraMetadata.add_extra_metadata_to(
                first,
                relation_type.name,
                second.pid.pid_value,
                second.pid.pid_type,
                **allowed,
            )
        return first

    def remove(self, first, second, relation_type):
        """Remove the relation between the first and the second."""
        self._validate_relation_type(relation_type)
        sr = SiblingsRelation(relation_type)
        sr.remove(pid=second.pid)

        # remove any metadata for this relation, if any
        # both first and second could have metadata for the relation
        RecordRelationsExtraMetadata.remove_extra_metadata_from(
            first, relation_type.name, second.pid.pid_value, second._pid_type
        )
        RecordRelationsExtraMetadata.remove_extra_metadata_from(
            second, relation_type.name, first.pid.pid_value, first._pid_type
        )
        return first, second


class RecordRelationsSequence(RecordRelations):
    """Add/Remove operations for Sequence relations."""

    def __init__(self):
        """Constructor."""
        self.relation_types = SEQUENCE_RELATION_TYPES

    def _validate_relation_between_records(
        self, previous_rec, next_rec, relation_name
    ):
        """Validate relation between type of records."""
        from invenio_app_ils.series.api import Series

        # records must be of the same type, Sequences support only Series
        allowed_types = [Series]

        for record_type in allowed_types:
            if isinstance(previous_rec, record_type) and isinstance(
                next_rec, record_type
            ):
                return True

        raise RecordRelationsError(
            "Cannot create a relation `{}` between PID `{}` with type {} "
            " and PID `{}` with type {}.".format(
                relation_name,
                previous_rec.pid.pid_value,
                previous_rec.pid.pid_type,
                next_rec.pid.pid_value,
                next_rec.pid.pid_type,
            )
        )

    def add(self, previous_rec, next_rec, relation_type, **kwargs):
        """Add a new sequence relation between previous and next records."""
        self._validate_relation_type(relation_type)
        self._validate_relation_between_records(
            previous_rec, next_rec, relation_type.name
        )

        sequence_relation = SequenceRelation(relation_type)
        sequence_relation.add(
            previous_pid=previous_rec.pid, next_pid=next_rec.pid
        )

    def remove(self, previous_rec, next_rec, relation_type):
        """Remove sequence relation between previous and next records."""
        self._validate_relation_type(relation_type)
        sequence_relation = SequenceRelation(relation_type)
        sequence_relation.remove(
            previous_pid=previous_rec.pid, next_pid=next_rec.pid
        )


class IlsRecordWithRelations(IlsRecord):
    """Add relations functionalities to records."""

    @property
    def relations(self):
        """Get record relations."""
        from .retriever import get_relations
        return get_relations(self)

    def clear(self):
        """Clear IlsRecordWithRelations record."""
        extra_metadata_field_name = RecordRelationsExtraMetadata.field_name()
        extra_metadata = self.get(extra_metadata_field_name, {})
        super().clear()
        self[extra_metadata_field_name] = extra_metadata

    def delete(self, **kwargs):
        """Delete record with relations."""
        related_refs = set()
        for name, related_objects in self.relations.items():
            for obj in related_objects:
                related_refs.add("{pid_value}:{pid_type}".format(**obj))
        if related_refs:
            raise RecordHasReferencesError(
                record_type=self.__class__.__name__,
                record_id=self["pid"],
                ref_type="related",
                ref_ids=sorted(ref for ref in related_refs),
            )

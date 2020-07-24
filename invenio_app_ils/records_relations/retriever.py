# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs to retrieve records relations."""

from invenio_app_ils.records.jsonresolvers.api import pick
from invenio_app_ils.relations.api import (PARENT_CHILD_RELATION_TYPES,
                                           SEQUENCE_RELATION_TYPES,
                                           SIBLINGS_RELATION_TYPES,
                                           ParentChildRelation,
                                           SequenceRelation, SiblingsRelation)

from .api import RecordRelationsExtraMetadata as RelationsExtraMetadata


class RelationObjectBuilderMixin(object):
    """Relations object builder."""

    def build_relations_object(
        self, pid_value, pid_type, relation_name, **kwargs
    ):
        """Build and return each object of `relations` field."""
        r = {
            "pid_value": pid_value,
            "pid_type": pid_type,
            "relation_type": relation_name,
        }
        r.update(kwargs)
        return r

    def get_relevant_fields_from(self, record):
        """Get relevant fields from the related record."""
        fields = pick(
            record,
            "title",
            "edition",
            "publication_year",
            "languages",
            "document_type",
            "mode_of_issuance",
        )
        return dict(record_metadata=fields)


class ParentChildRetriever(RelationObjectBuilderMixin):
    """Retrieve relations of type ParentChild."""

    def __init__(self, child_record):
        """Constructor."""
        self.child_record = child_record

    def _build_relation_obj(self, child, parent_pid, relation_type):
        """Return the relation object with any extra metadata."""
        pid_value = parent_pid.pid_value
        pid_type = parent_pid.pid_type

        r = self.build_relations_object(pid_value, pid_type, relation_type)

        metadata = RelationsExtraMetadata.get_extra_metadata_from(
            child, relation_type, parent_pid.pid_value, parent_pid.pid_type
        )
        # copy the extra metadata into the relation, if any
        r.update(metadata)

        # fetch the parent to retrieve useful metadata (title, ...)
        from invenio_app_ils.records.api import IlsRecord
        parent = IlsRecord.get_record_by_pid(pid_value, pid_type=pid_type)

        # copy relevant fields from parent into the relation
        relevant_fields = self.get_relevant_fields_from(parent)
        r.update(relevant_fields)
        return r

    def get(self):
        """Return only relations that this record has with parents.

        Given that in ILS system parent records (e.g. journal, periodicals)
        can have a very high number of children but only a few parents,
        only relations with the parents are returned.
        """
        relations = {}
        for relation_type in PARENT_CHILD_RELATION_TYPES:
            pcr = ParentChildRelation(relation_type)
            name = relation_type.name

            for parent_pid in pcr.get_parents_of(self.child_record.pid):
                r = self._build_relation_obj(
                    self.child_record, parent_pid, name
                )
                relations.setdefault(name, [])
                relations[name].append(r)
        return relations


class SiblingsRetriever(RelationObjectBuilderMixin):
    """Retrieve relations of type Siblings."""

    def __init__(self, record):
        """Constructor."""
        self.record = record

    @staticmethod
    def _get_extra_metadata(record, sibling, relation_type):
        """Retrieve any extra metadata in the current record or sibling."""
        record_pid = record.pid
        sibling_pid = sibling.pid
        # we don't know it extra metadata are stored in this record or in the
        # sibling. Need to check both.
        metadata = {}

        # get any extra metadata stored in this record for the relation with
        # the sibling
        rec_metadata = RelationsExtraMetadata.get_extra_metadata_from(
            record, relation_type, sibling_pid.pid_value, sibling_pid.pid_type
        )
        metadata.update(rec_metadata)

        # get any extra metadata stored in the sibling for the relation with
        # this record
        sibling_metadata = RelationsExtraMetadata.get_extra_metadata_from(
            sibling, relation_type, record_pid.pid_value, record_pid.pid_type
        )
        if (
            sibling_metadata
            and "pid_value" in sibling_metadata
            and "pid_type" in sibling_metadata
        ):
            # the extra metadata in the sibling has pid_value and pid_type of
            # this record. Replace it with the sibling ones.
            sibling_metadata["pid_value"] = sibling_pid.pid_value
            sibling_metadata["pid_type"] = sibling_pid.pid_type

        metadata.update(sibling_metadata)
        return metadata

    def _build_relation_obj(self, sibling_pid, relation_type):
        """Return the relation object with metadata."""
        pid_value = sibling_pid.pid_value
        pid_type = sibling_pid.pid_type

        r = self.build_relations_object(pid_value, pid_type, relation_type)

        # fetch the sibling to retrieve useful metadata (title, ...) and also
        # any optional extra metadata for this relation
        from invenio_app_ils.records.api import IlsRecord
        sibling = IlsRecord.get_record_by_pid(pid_value, pid_type=pid_type)

        metadata = self._get_extra_metadata(
            self.record, sibling, relation_type
        )
        # copy the extra metadata into the relation, if any
        r.update(metadata)

        # copy relevant fields from sibling into the relation
        relevant_fields = self.get_relevant_fields_from(sibling)
        r.update(relevant_fields)
        return r

    def get(self):
        """Get all sibling relations with the current record."""
        relations = {}
        for relation_type in SIBLINGS_RELATION_TYPES:
            sr = SiblingsRelation(relation_type)
            name = relation_type.name

            for sibling_pid in sr.all(self.record.pid):
                r = self._build_relation_obj(sibling_pid, name)
                relations.setdefault(name, [])
                relations[name].append(r)
        return relations


class SequenceRetriever(RelationObjectBuilderMixin):
    """Retrieve relations of type Sequence."""

    ORDER_FIELD_NAME = "relation_order"
    ORDER_VALUE_NEXT = "continues"
    ORDER_VALUE_PREVIOUS = "is_continued_by"

    def __init__(self, record):
        """Constructor."""
        self.record = record

    def _build_relation_obj(self, related_pid, relation_type):
        """Return the relation object with metadata."""
        pid_value = related_pid.pid_value
        pid_type = related_pid.pid_type

        r = self.build_relations_object(pid_value, pid_type, relation_type)

        # fetch the sequence to retrieve useful metadata (title, ...)
        from invenio_app_ils.records.api import IlsRecord
        seq_rec = IlsRecord.get_record_by_pid(pid_value, pid_type=pid_type)

        # copy relevant fields from the sequence record into the relation
        relevant_fields = self.get_relevant_fields_from(seq_rec)
        r.update(relevant_fields)
        return r

    def get(self):
        """Get all sequence relations with the current record."""
        relations = {}
        for relation_type in SEQUENCE_RELATION_TYPES:
            sqr = SequenceRelation(relation_type)
            name = relation_type.name

            # pid_5 --- is previous of ---> [next_6, next_7, ...]
            for pid in sqr.pid_is_previous(self.record.pid):
                r = self._build_relation_obj(pid, name)
                r[self.ORDER_FIELD_NAME] = self.ORDER_VALUE_PREVIOUS
                relations.setdefault(name, [])
                relations[name].append(r)

            # pid_5 --- is next of ---> [previous_3, previous_4, ...]
            for pid in sqr.pid_is_next(self.record.pid):
                r = self._build_relation_obj(pid, name)
                r[self.ORDER_FIELD_NAME] = self.ORDER_VALUE_NEXT
                relations.setdefault(name, [])
                relations[name].append(r)
        return relations


def get_relations(record):
    """Get all relations for the given record."""
    relations = {}

    pc_rels = ParentChildRetriever(record).get()
    relations.update(pc_rels)

    sibl_rels = SiblingsRetriever(record).get()
    relations.update(sibl_rels)

    seq_rels = SequenceRetriever(record).get()
    relations.update(seq_rels)

    return relations

# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""PIDRelation APIs wrapper."""

from collections import namedtuple

from invenio_db import db
from invenio_pidrelations.api import PIDRelation
from invenio_pidrelations.config import RelationType
from sqlalchemy import and_, or_

from invenio_app_ils.errors import RecordRelationsError

ILS_RELATION_TYPE = namedtuple(
    "IlsRelationType",
    RelationType._fields
    + (
        "relation_class",
        "sort_by",
    ),
)

LANGUAGE_RELATION = ILS_RELATION_TYPE(
    0,
    "language",
    "Language",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.SiblingsRelation",
    None,
)
EDITION_RELATION = ILS_RELATION_TYPE(
    1,
    "edition",
    "Edition",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.SiblingsRelation",
    ["edition"],
)
OTHER_RELATION = ILS_RELATION_TYPE(
    2,
    "other",
    "Other",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.SiblingsRelation",
    None,
)
MULTIPART_MONOGRAPH_RELATION = ILS_RELATION_TYPE(
    3,
    "multipart_monograph",
    "Multipart Monograph",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.ParentChildRelation",
    None,
)
SERIAL_RELATION = ILS_RELATION_TYPE(
    4,
    "serial",
    "Serial",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.ParentChildRelation",
    None,
)
SEQUENCE_RELATION = ILS_RELATION_TYPE(
    5,
    "sequence",
    "Sequence",
    "invenio_app_ils.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.relations.api.SequenceRelation",
    None,
)


PARENT_CHILD_RELATION_TYPES = [MULTIPART_MONOGRAPH_RELATION, SERIAL_RELATION]

SIBLINGS_RELATION_TYPES = [LANGUAGE_RELATION, EDITION_RELATION, OTHER_RELATION]

SEQUENCE_RELATION_TYPES = [SEQUENCE_RELATION]

ILS_PIDRELATIONS_TYPES = (
    PARENT_CHILD_RELATION_TYPES + SIBLINGS_RELATION_TYPES + SEQUENCE_RELATION_TYPES
)


class Relation(object):
    """Manage related records."""

    def __init__(self, relation_type):
        """Initialize related records.

        :param relation_type: `RelationType` named tuple
        """
        self.relation_type = relation_type

    @staticmethod
    def get_relation_by_name(name):
        """Get the relation_type by name."""
        for relation in ILS_PIDRELATIONS_TYPES:
            if relation.name == name:
                return relation
        raise RecordRelationsError(
            "A relation type with name `{}` does not exist".format(name)
        )

    def get_relations_by_parent(self, pid):
        """Get all relations where the given PID is a parent."""
        return PIDRelation.query.filter_by(
            parent=pid, relation_type=self.relation_type.id
        ).all()

    def get_relations_by_child(self, pid):
        """Get all relations where the given PID is a child."""
        return PIDRelation.query.filter_by(
            child=pid, relation_type=self.relation_type.id
        ).all()

    def get_any_relation_of(self, *pids):
        """Get any relation when given PIDs are parent or child.

        :arg pids: one or multiple PIDs
        """
        all_relation_pids = set()

        for pid in pids:
            query = PIDRelation.query.filter_by(
                relation_type=self.relation_type.id
            ).filter(or_(PIDRelation.parent == pid, PIDRelation.child == pid))

            results = query.all()
            if results:
                parent = results[0].parent
                if parent == pid:
                    for result in results:
                        all_relation_pids.add(result)
                else:
                    # get relations of the parent
                    for result in self.get_relations_by_parent(parent):
                        all_relation_pids.add(result)

        return list(all_relation_pids)

    def relation_exists(self, parent_pid, child_pid):
        """Determine if given relation already exists."""
        return (
            PIDRelation.query.filter_by(relation_type=self.relation_type.id)
            .filter(
                or_(
                    and_(
                        PIDRelation.parent == parent_pid,
                        PIDRelation.child == child_pid,
                    ),
                    and_(
                        PIDRelation.parent == child_pid,
                        PIDRelation.child == parent_pid,
                    ),
                )
            )
            .count()
            > 0
        )


class ParentChildRelation(Relation):
    """Relation class for parent-child type."""

    def get_children_of(self, pid):
        """Get all children PID for relations where the given PID is parent."""
        return [r.child for r in self.get_relations_by_parent(pid)]

    def get_parents_of(self, pid):
        """Get all parents PID for relations where the given PID is child."""
        return [r.parent for r in self.get_relations_by_child(pid)]

    def add(self, parent_pid, child_pid):
        """Add a new relation between parent and child."""
        if self.relation_exists(parent_pid, child_pid):
            raise RecordRelationsError(
                "The relation `{}` between PID `{}` and PID `{}` already "
                "exists".format(
                    self.relation_type.name,
                    parent_pid.pid_value,
                    child_pid.pid_value,
                )
            )

        with db.session.begin_nested():
            return PIDRelation.create(parent_pid, child_pid, self.relation_type.id)

    def remove(self, parent_pid, child_pid):
        """Delete the relation for the given PIDs."""
        relation = PIDRelation.query.filter_by(
            parent_id=parent_pid.id,
            child_id=child_pid.id,
            relation_type=self.relation_type.id,
        ).one_or_none()

        if not relation:
            raise RecordRelationsError(
                "The relation `{}` between PID `{}` and PID `{}` does not "
                "exists".format(
                    self.relation_type.name,
                    parent_pid.pid_value,
                    child_pid.pid_value,
                )
            )

        with db.session.begin_nested():
            db.session.delete(relation)


class SiblingsRelation(Relation):
    """Relation class for siblings type."""

    def all(self, pid):
        """Get all PIDs that have a relation with the given PID."""
        related_pids = set()
        for r in self.get_any_relation_of(pid):
            # exclude itself
            if r.parent != pid:
                related_pids.add(r.parent)
            if r.child != pid:
                related_pids.add(r.child)

        return list(related_pids)

    def _recreate_relations_with_random_parent(
        self, relations_to_delete, pids_to_relate
    ):
        """Delete existing relations and re-create them with a new parent."""
        # elect a new parent randomly
        new_parent = pids_to_relate.pop()
        # get the remaining PIDs, future children
        remaining_pids = list(pids_to_relate)

        with db.session.begin_nested():
            # delete all existing relations
            for rel in relations_to_delete:
                db.session.delete(rel)

            # re-create all relations with the new parent
            for pid in remaining_pids:
                PIDRelation.create(new_parent, pid, self.relation_type.id)

    def add(self, first_pid, second_pid):
        """Create a new relation between first and second.

        Use cases:

          * first or second have no relations of this type: simply create
            the relation by using the first has parent and the second as child.

          * first or second have already an existing relation of this type.
            In this case, all PIDs of any relation of first or second are
            removed from the db.
            All PIDs, including the new ones, are added to a set for new
            relations to create. A new parent is randomly chosen from this set
            and new relations are created.

        Example:
            1 -> 2 <rel-type-1>
            1 -> 3 <rel-type-1>
            4 -> 5 <rel-type-1>

            add(3, 4)

            1 -> 2 <rel-type-1>
            1 -> 3 <rel-type-1>
            1 -> 4 <rel-type-1>
            1 -> 5 <rel-type-1>

        """
        # get all relations where first is a parent or a child, or second is
        # a parent or a child (any relation where first or second are involved)
        all_relations = self.get_any_relation_of(first_pid, second_pid)

        if not all_relations:
            # parent or child has no relations yet
            PIDRelation.create(first_pid, second_pid, self.relation_type.id)
        else:
            if self.relation_exists(first_pid, second_pid):
                # there should be only one possible relation for this PID
                # for a given `relation_type`
                # do not raise because it might be that user is just adding
                # metadata to an existing relation
                return

            # parent or child has already at least one relation

            # compute a `set` with all PIDs
            pids_to_relate = set()
            for rel in all_relations:
                pids_to_relate.add(rel.parent)
                pids_to_relate.add(rel.child)

            # add to the set the first and the second (the new relation)
            pids_to_relate.add(first_pid)
            pids_to_relate.add(second_pid)

            self._recreate_relations_with_random_parent(all_relations, pids_to_relate)

    def remove(self, pid):
        """Remove the only possible relation of this given PID.

        If the given PID is a child, or only one relation exists, the relation
        involving PID is simply removed.

        When the given PID is a parent of many relations, then it is deleted
        and a new parent is chosen as when adding new relations.

        Example:
            1 -> 2 <rel-type-1>
            1 -> 3 <rel-type-1>
            1 -> 4 <rel-type-1>
            1 -> 5 <rel-type-1>

            remove(1)

            2 -> 3 <rel-type-1>
            2 -> 4 <rel-type-1>
            2 -> 5 <rel-type-1>

        """
        # get all relations where first is a parent or a child, or second is
        # a parent or a child (any relation where first or second are involved)
        all_relations = self.get_any_relation_of(pid)
        if not all_relations:
            return

        # if there is only one relation involving the given PID, or it is a
        # parent with only one relation or it is a child
        if len(all_relations) == 1:
            # only of relation exists for the given PID, simply delete it
            with db.session.begin_nested():
                db.session.delete(all_relations[0])
        else:
            # given PID is a parent and there are multiple relations with this
            # parent. Elect a new parent and adjust all relations attached to
            # it
            pids_to_relate = set()
            for rel in all_relations:
                pids_to_relate.add(rel.parent)
                pids_to_relate.add(rel.child)

            try:
                # remove the PID for the relation to delete
                pids_to_relate.remove(pid)
            except KeyError:
                raise RecordRelationsError(
                    "Error deleting relation_type `{}` for PID `{}`: the PID "
                    "is not found in all relations of this type.".format(
                        self.relation_type.name, pid.pid_value
                    )
                )

            self._recreate_relations_with_random_parent(all_relations, pids_to_relate)


class SequenceRelation(Relation):
    """Relation class for sequence type."""

    def pid_is_previous(self, pid):
        """Get rels with PID as parent: PID is the previous of children."""
        return [r.child for r in self.get_relations_by_parent(pid)]

    def pid_is_next(self, pid):
        """Get rels with PID as parent: PID is the next of children."""
        return [r.parent for r in self.get_relations_by_child(pid)]

    def add(self, previous_pid, next_pid):
        """Add a new relation between previous and next pid."""
        if self.relation_exists(previous_pid, next_pid):
            raise RecordRelationsError(
                "The relation `{}` between PID `{}` and PID `{}` "
                "already exists".format(
                    self.relation_type.name,
                    previous_pid.pid_value,
                    next_pid.pid_value,
                )
            )

        with db.session.begin_nested():
            return PIDRelation.create(previous_pid, next_pid, self.relation_type.id)

    def remove(self, previous_pid, next_pid):
        """Delete the relation for the given PIDs."""
        relation = PIDRelation.query.filter_by(
            parent_id=previous_pid.id,
            child_id=next_pid.id,
            relation_type=self.relation_type.id,
        ).one_or_none()

        if not relation:
            raise RecordRelationsError(
                "The relation `{}` between PID `{}` and PID `{}` does not "
                "exists".format(
                    self.relation_type.name,
                    previous_pid.pid_value,
                    next_pid.pid_value,
                )
            )

        with db.session.begin_nested():
            db.session.delete(relation)

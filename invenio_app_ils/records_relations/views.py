# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Records views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, current_app, request
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.errors import RecordRelationsError
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.pidstore.pids import SERIES_PID_TYPE
from invenio_app_ils.records.api import IlsRecord
from invenio_app_ils.records_relations.indexer import RecordRelationIndexer
from invenio_app_ils.relations.api import Relation

from invenio_app_ils.records_relations.api import (  # isort:skip
    RecordRelationsParentChild,
    RecordRelationsSiblings,
)


def create_relations_blueprint(app):
    """Add relations views to the blueprint."""
    def _add_resource_view(blueprint, pid_type, view_class):
        """Add a resource view for a rest endpoint."""
        endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
        options = endpoints.get(pid_type, {})
        default_media_type = options.get("default_media_type", "")
        rec_serializers = options.get("record_serializers", {})
        serializers = {
            mime: obj_or_import_string(func)
            for mime, func in rec_serializers.items()
        }
        record_relations = view_class.as_view(
            view_class.view_name.format(pid_type),
            serializers=serializers,
            default_media_type=default_media_type,
        )
        blueprint.add_url_rule(
            "{0}/relations".format(options["item_route"]),
            view_func=record_relations,
            methods=["POST", "DELETE"],
        )

    bp = Blueprint("invenio_app_ils_relations", __name__, url_prefix="")

    _add_resource_view(bp, DOCUMENT_PID_TYPE, RecordRelationsResource)
    _add_resource_view(bp, SERIES_PID_TYPE, RecordRelationsResource)

    return bp


class RecordRelationsResource(ContentNegotiatedMethodView):
    """Relations views for a record."""

    view_name = "{0}_relations"

    def _get_record(self, record, pid, pid_type):
        """Return record if same PID or fetch the record."""
        if record.pid == pid and record._pid_type == pid_type:
            rec = record
        else:
            rec = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)
        return rec

    def _validate_parent_child_creation_payload(self, payload):
        """Validate the payload when creating a new parent-child relation."""
        try:
            parent_pid = payload.pop("parent_pid")
            parent_pid_type = payload.pop("parent_pid_type")
            child_pid = payload.pop("child_pid")
            child_pid_type = payload.pop("child_pid_type")
        except KeyError as key:
            raise RecordRelationsError(
                "The `{}` is a required field".format(key)
            )

        return parent_pid, parent_pid_type, child_pid, child_pid_type, payload

    def _create_parent_child_relation(self, record, relation_type, payload):
        """Create a Parent-Child relation.

        Expected payload:

            {
                parent_pid: <pid_value>,
                parent_pid_type: <pid_type>,
                child_pid: <pid_value>,
                child_pid_type: <pid_type>,
                relation_type: "<Relation name>",
                [volume: "<vol name>"]
            }
        """
        parent_pid, parent_pid_type, child_pid, child_pid_type, metadata = self._validate_parent_child_creation_payload(
            payload
        )

        # fetch parent and child. The passed record should be one of the two
        parent = self._get_record(record, parent_pid, parent_pid_type)
        child = self._get_record(record, child_pid, child_pid_type)

        rr = RecordRelationsParentChild()
        modified_record = rr.add(
            parent=parent, child=child, relation_type=relation_type, **metadata
        )
        return modified_record, parent, child

    def _delete_parent_child_relation(self, record, relation_type, payload):
        """Delete a Parent-Child relation.

        Expected payload:

            {
                parent_pid: <pid_value>,
                parent_pid_type: <pid_type>,
                child_pid: <pid_value>,
                child_pid_type: <pid_type>,
                relation_type: "<Relation name>"
            }
        """
        parent_pid, parent_pid_type, child_pid, child_pid_type, _ = self._validate_parent_child_creation_payload(
            payload
        )

        # fetch parent and child. The passed record should be one of the two
        parent = self._get_record(record, parent_pid, parent_pid_type)
        child = self._get_record(record, child_pid, child_pid_type)

        rr = RecordRelationsParentChild()
        modified_record = rr.remove(
            parent=parent, child=child, relation_type=relation_type
        )
        return modified_record, parent, child

    def _validate_siblings_creation_payload(self, payload):
        """Validate the payload when creating a new siblings relation."""
        try:
            pid = payload.pop("pid")
            pid_type = payload.pop("pid_type")
        except KeyError as key:
            raise RecordRelationsError(
                "The `{}` is a required field".format(key)
            )

        return pid, pid_type, payload

    def _create_sibling_relation(self, record, relation_type, payload):
        """Create a Siblings relation from current record to the given PID.

        Expected payload:

            {
                pid: <pid_value>,
                pid_type: <pid_type>,
                relation_type: "<Relation name>",
                [note: "<note>"]
            }
        """
        pid, pid_type, metadata = self._validate_siblings_creation_payload(
            payload
        )

        if pid == record["pid"] and pid_type == record._pid_type:
            raise RecordRelationsError(
                "Cannot create a relation for PID `{}` with itself".format(pid)
            )

        second = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)

        rr = RecordRelationsSiblings()
        modified_record = rr.add(
            first=record,
            second=second,
            relation_type=relation_type,
            **metadata
        )
        return modified_record, record, second

    def _delete_sibling_relation(self, record, relation_type, payload):
        """Delete a Siblings relation from current record to the given PID.

        Expected payload:

            {
                pid: <pid_value>,
                pid_type: <pid_type>,
                relation_type: "<Relation name>"
            }
        """
        pid, pid_type, metadata = self._validate_siblings_creation_payload(
            payload
        )

        if pid == record["pid"] and pid_type == record._pid_type:
            raise RecordRelationsError(
                "Cannot create a relation for PID `{}` with itself".format(pid)
            )

        second = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)

        rr = RecordRelationsSiblings()
        modified_record, _ = rr.remove(
            first=record, second=second, relation_type=relation_type
        )
        return modified_record, record, second

    @pass_record
    @need_permissions("relations-create")
    def post(self, record, **kwargs):
        """Create a new relation."""
        def create(payload):
            try:
                relation_type = payload.pop("relation_type")
            except KeyError as key:
                return abort(400, "The `{}` is a required field".format(key))

            rt = Relation.get_relation_by_name(relation_type)

            if rt in current_app.config["PARENT_CHILD_RELATION_TYPES"]:
                modified, first, second = self._create_parent_child_relation(
                    record, rt, payload
                )
            elif rt in current_app.config["SIBLINGS_RELATION_TYPES"]:
                modified, first, second = self._create_sibling_relation(
                    record, rt, payload
                )
            else:
                raise RecordRelationsError(
                    "Invalid relation type `{}`".format(rt.name)
                )

            db.session.commit()

            records_to_index.append(first)
            records_to_index.append(second)

            # if the record is the modified, return the modified version
            if (
                modified.pid == record.pid
                and modified._pid_type == record._pid_type
            ):
                return modified
            return record

        records_to_index = []
        actions = request.get_json()
        if not isinstance(actions, list):
            actions = [actions]

        for action in actions:
            record = create(action)

        # Index both parent/child (or first/second)
        RecordRelationIndexer().index(record, *records_to_index)

        return self.make_response(record.pid, record, 201)

    @pass_record
    @need_permissions("relations-delete")
    def delete(self, record, **kwargs):
        """Delete an existing relation."""
        def delete(payload):
            try:
                relation_type = payload.pop("relation_type")
            except KeyError as key:
                return abort(400, "The `{}` is a required field".format(key))

            rt = Relation.get_relation_by_name(relation_type)

            if rt in current_app.config["PARENT_CHILD_RELATION_TYPES"]:
                modified, first, second = self._delete_parent_child_relation(
                    record, rt, payload
                )
            elif rt in current_app.config["SIBLINGS_RELATION_TYPES"]:
                modified, first, second = self._delete_sibling_relation(
                    record, rt, payload
                )
            else:
                raise RecordRelationsError(
                    "Invalid relation type `{}`".format(rt.name)
                )

            db.session.commit()

            records_to_index.append(first)
            records_to_index.append(second)

            # if the record is the modified, return the modified version
            if (
                modified.pid == record.pid
                and modified._pid_type == record._pid_type
            ):
                return modified
            return record

        records_to_index = []
        actions = request.get_json()
        if not isinstance(actions, list):
            actions = [actions]

        for action in actions:
            record = delete(action)

        # Index both parent/child (or first/second)
        RecordRelationIndexer().index(record, *records_to_index)

        return self.make_response(record.pid, record, 200)

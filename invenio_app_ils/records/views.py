# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Records views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app, request
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record

from invenio_app_ils.circulation.views import IlsResource
from invenio_app_ils.errors import RelatedRecordError
from invenio_app_ils.pidstore.pids import DOCUMENT_PID_TYPE, SERIES_PID_TYPE
from invenio_app_ils.records.api import IlsRecord
from invenio_app_ils.records.related.api import RelatedRecords


def create_relations_blueprint(app):
    """Add relations views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_relations",
        __name__,
        url_prefix="",
    )

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    related_pid_types = (DOCUMENT_PID_TYPE, SERIES_PID_TYPE)

    for pid_type in related_pid_types:
        options = endpoints.get(pid_type, {})
        rec_serializers = {
            "application/json": (
                "invenio_records_rest.serializers:json_v1_response"
            )
        }
        serializers = {
            mime: obj_or_import_string(func)
            for mime, func in rec_serializers.items()
        }
        record_relations = RelationResource.as_view(
            RelationResource.view_name.format(pid_type),
            serializers=serializers,
            ctx=dict()
        )
        blueprint.add_url_rule(
            "{0}/relations".format(options["item_route"]),
            view_func=record_relations,
            methods=["GET", "POST"]
        )
    return blueprint


class RelationResource(IlsResource):
    """Record relation resource."""

    view_name = "{0}_relations"

    def get_size(self, record):
        """Get the size for number of related records to return per type."""
        return int(request.args.get("size", len(record["related_records"])))

    def _extend_related_records(self, record, size):
        """Extend record's related_record data with more fields."""
        count = {
            relation.name: 0
            for relation in current_app.config["PIDRELATIONS_RELATION_TYPES"]
        }
        related_records = []
        for obj in record["related_records"]:
            count[obj["relation_type"]] += 1
            if count[obj["relation_type"]] > size:
                continue
            related = IlsRecord.get_record_by_pid(
                obj["pid"],
                pid_type=obj["pid_type"]
            )
            obj["title"] = related.get("title", "")
            obj["edition"] = related.get("edition", "")
            obj["language"] = related.get("language", "")
            related_records.append(obj)
        record["related_records"] = related_records
        record["related_records_count"] = count

    @pass_record
    def get(self, record, **kwargs):
        """Get related records."""
        size = self.get_size(record)
        self._extend_related_records(record, size)
        pid = record[record.pid_field]
        for key in list(record.keys()):
            if not key.startswith("related_records"):
                del record[key]
        return self.make_response(pid, record, 200)

    @pass_record
    def post(self, record, **kwargs):
        """Update relations."""
        for obj in request.get_json():
            related = IlsRecord.get_record_by_pid(
                obj["pid"],
                pid_type=obj["pid_type"]
            )
            relation_type = RelatedRecords.get_relation_by_name(
                obj["relation_type"]
            )
            action = obj.get("action", "")
            if action == "add":
                record.related.add(related, relation_type)
            elif action == "remove":
                record.related.remove(related, relation_type)
            else:
                raise RelatedRecordError(
                    ("Failed to update related records - "
                     "invalid action: {}").format(action)
                )
        record.commit()
        db.session.commit()
        size = self.get_size(record)
        self._extend_related_records(record, size)
        return self.make_response(record[record.pid_field], record, 200)

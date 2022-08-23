# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS files views."""

from flask import Blueprint
from invenio_db import db
from invenio_files_rest.models import Bucket
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.eitems.api import EITEM_PID_TYPE
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.proxies import current_app_ils


def create_files_blueprint(app):
    """Add files views to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_files", __name__, url_prefix="")
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get(EITEM_PID_TYPE, {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func) for mime, func in rec_serializers.items()
    }
    record_bucket_view = RecordBucketResource.as_view(
        RecordBucketResource.view_name.format(EITEM_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
    )
    blueprint.add_url_rule(
        "{0}/bucket".format(options["item_route"]),
        view_func=record_bucket_view,
        methods=["POST"],
    )

    return blueprint


class RecordBucketResource(ContentNegotiatedMethodView):
    """Files views for a record."""

    view_name = "{0}_bucket"

    @pass_record
    @need_permissions("bucket-create")
    def post(self, record, **kwargs):
        """Create a new bucket or retrieve existing."""
        if "bucket_id" in record:
            return self.make_response(record.pid, record, 200)

        with db.session.begin_nested():
            bucket = Bucket.create()
            record["bucket_id"] = str(bucket.id)
            record.commit()
        db.session.commit()
        current_app_ils.eitem_indexer.index(record)
        return self.make_response(record.pid, record, 201)

# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL views."""

from __future__ import absolute_import, print_function

from flask import Blueprint
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.permissions import need_permissions

from .api import BORROWING_REQUEST_PID_TYPE
from .errors import ILLError
from .loaders import create_loan_loader
from .proxies import current_ils_ill


def create_ill_actions_blueprint(app):
    """Create ILL actions blueprint."""
    blueprint = Blueprint("ils_ill_actions", __name__, url_prefix="")

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get(BORROWING_REQUEST_PID_TYPE, {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    accept_view = CreateLoanResource.as_view(
        CreateLoanResource.view_name.format(BORROWING_REQUEST_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(loader=create_loan_loader),
    )
    blueprint.add_url_rule(
        "{0}/create-loan".format(options["item_route"]),
        view_func=accept_view,
        methods=["POST"],
    )

    return blueprint


class ILLActionResource(ContentNegotiatedMethodView):
    """ILL action resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class CreateLoanResource(ILLActionResource):
    """Create loan action resource."""

    view_name = "{}_create_loan"

    @pass_record
    @need_permissions("ill-create-loan")
    def post(self, pid, record, **kwargs):
        """Create loan action implementation."""
        data = self.loader()

        if record["status"] != "REQUESTED":
            raise ILLError(
                "A loan can be created only when the borrowing request is in "
                "requested status."
            )

        if record.get("loan_pid"):
            raise ILLError(
                "This borrowing request {} has already a loan ({}).".format(
                    record["pid"], record["loan_pid"]
                )
            )

        record["loan_end_date"] = data["loan_end_date"]
        record.create_loan()

        record.commit()
        db.session.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(record)
        return self.make_response(pid, record, 200)

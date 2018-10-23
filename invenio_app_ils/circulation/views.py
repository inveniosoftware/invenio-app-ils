# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, current_app, request
from invenio_circulation.errors import CirculationException, \
    InvalidCirculationPermission
from invenio_circulation.links import loan_links_factory
from invenio_circulation.views import create_error_handlers
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

from ..views import need_permissions
from .api import request_loan


def create_circulation_blueprint(_):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation",
        __name__,
        url_prefix="",
    )

    create_error_handlers(blueprint)

    rec_serializers = {
        "application/json": (
            "invenio_records_rest.serializers" ":json_v1_response"
        )
    }
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    loan_request = LoanRequestResource.as_view(
        LoanRequestResource.view_name,
        serializers=serializers,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "/circulation/loans/request", view_func=loan_request, methods=["POST"]
    )
    return blueprint


class IlsResource(ContentNegotiatedMethodView):
    """ILS resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super(IlsResource, self).__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class LoanRequestResource(IlsResource):
    """Loan action resource."""

    view_name = "loan_request"

    @need_permissions('circulation-loan-request')
    def post(self, **kwargs):
        """Loan request view."""
        try:
            pid, loan = request_loan(request.get_json())
        except InvalidCirculationPermission as ex:
            current_app.logger.exception(ex.msg)
            return abort(403)
        except CirculationException as ex:
            current_app.logger.exception(ex.msg)
            return abort(400)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )

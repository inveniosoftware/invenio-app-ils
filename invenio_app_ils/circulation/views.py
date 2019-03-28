# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from __future__ import absolute_import, print_function

from functools import wraps

from flask import Blueprint, current_app, request
from invenio_circulation.links import loan_links_factory
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.permissions import check_permission

from .api import create_loan, request_loan


def need_permissions(action):
    """View decorator to check permissions for the given action or abort.

    :param action: The action needed.
    """
    def decorator_builder(f):
        @wraps(f)
        def decorate(*args, **kwargs):
            check_permission(
                current_app.config["ILS_VIEWS_PERMISSIONS_FACTORY"](action)
            )
            return f(*args, **kwargs)
        return decorate
    return decorator_builder


def create_circulation_blueprint(_):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation",
        __name__,
        url_prefix="",
    )

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

    loan_create = LoanCreateResource.as_view(
        LoanCreateResource.view_name,
        serializers=serializers,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "/circulation/loans/create", view_func=loan_create, methods=["POST"]
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
    """Loan request action resource."""

    view_name = "loan_request"

    @need_permissions('circulation-loan-request')
    def post(self, **kwargs):
        """Loan request post method."""
        pid, loan = request_loan(request.get_json())

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class LoanCreateResource(IlsResource):
    """Loan create action resource."""

    view_name = "loan_create"

    @need_permissions('circulation-loan-create')
    def post(self, **kwargs):
        """Loan create post method."""
        pid, loan = create_loan(request.get_json())

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )

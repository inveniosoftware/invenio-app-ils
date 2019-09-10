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
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.utils import circulation_get_patron_from_loan
from invenio_app_ils.permissions import check_permission

from .api import create_loan, request_loan
from .mail.tasks import send_overdue_mail


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


def create_circulation_blueprint(app):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation",
        __name__,
        url_prefix="",
    )

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get('loanid', {})
    rec_serializers = options.get("record_serializers", {})
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

    loan_mail = LoanMailResource.as_view(
        LoanMailResource.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "{0}/email".format(options["item_route"]),
        view_func=loan_mail,
        methods=["POST"]
    )
    return blueprint


class IlsCirculationResource(ContentNegotiatedMethodView):
    """ILS resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super(IlsCirculationResource, self).__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class LoanRequestResource(IlsCirculationResource):
    """Loan request action resource."""

    view_name = "loan_request"

    @need_permissions('circulation-loan-request')
    def post(self, **kwargs):
        """Loan request post method."""
        pid, loan = request_loan(request.get_json())

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class LoanCreateResource(IlsCirculationResource):
    """Loan create action resource."""

    view_name = "loan_create"

    @need_permissions('circulation-loan-create')
    def post(self, **kwargs):
        """Loan create post method."""
        params = request.get_json()
        should_force_checkout = params.pop("force_checkout")\
            if "force_checkout" in params else False
        pid, loan = create_loan(params, should_force_checkout)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class LoanMailResource(IlsCirculationResource):
    """Loan send email."""

    view_name = "{0}_email"

    @need_permissions('circulation-loan-email')
    @pass_record
    def post(self, pid, record, **kwargs):
        """Loan email post method."""
        patron = circulation_get_patron_from_loan(record)
        send_overdue_mail(record, patron, recipients=[patron.email])
        return self.make_response(
            pid, record, 202, links_factory=self.links_factory
        )

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, current_app, request
from invenio_circulation.api import Loan
from invenio_circulation.errors import InvalidCirculationPermission, \
    ItemNotAvailable, NoValidTransitionAvailable
from invenio_circulation.links import loan_links_factory
from invenio_circulation.pid.minters import loan_pid_minter
from invenio_circulation.proxies import current_circulation
from invenio_circulation.views import create_error_handlers
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.views import need_permissions

circulation_blueprint = Blueprint(
    "invenio_app_ils_circulation",
    __name__,
    url_prefix="",
)


def add_circulation_views(blueprint):
    """Add circulation views to the blueprint."""
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
        loan = Loan.create({})
        pid = loan_pid_minter(loan.id, loan)
        params = request.get_json()
        try:
            loan = current_circulation.circulation.trigger(
                loan, **dict(params, trigger="request")
            )
            db.session.commit()
        except (ItemNotAvailable, NoValidTransitionAvailable) as ex:
            current_app.logger.exception(ex.msg)
            abort(400)
        except InvalidCirculationPermission as ex:
            current_app.logger.exception(ex.msg)
            abort(403)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )

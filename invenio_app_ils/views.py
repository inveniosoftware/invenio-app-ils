# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Blueprint used for loading templates.

The sole purpose of this blueprint is to ensure that Invenio can find the
templates and static files located in the folders of the same names next to
this file.
"""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app, request, render_template, url_for
from flask_login import login_required

from invenio_circulation.api import Loan
from invenio_circulation.errors import (
    InvalidCirculationPermission,
    ItemNotAvailable,
    LoanActionError,
    NoValidTransitionAvailable,
)
from invenio_circulation.links import loan_links_factory

from invenio_circulation.views import create_error_handlers
from invenio_circulation.pid.minters import loan_pid_minter
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

blueprint = Blueprint(
    "invenio_app_ils",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="",
)


@blueprint.route("/<path:path>", methods=["GET"])
@login_required
def index(path):
    """UI base view."""
    return render_template('invenio_app_ils/index.html')


def build_loan_request_blueprint(app, blueprint):
    """."""
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
        "/loan_request", view_func=loan_request, methods=["POST"]
    )
    return blueprint


class IlsResource(ContentNegotiatedMethodView):
    """ILS resource."""

    view_name = "ils_resource"

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super(IlsResource, self).__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class LoanRequestResource(IlsResource):
    """Loan action resource."""

    view_name = "loan_request"

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
        except (
            ItemNotAvailable,
            InvalidCirculationPermission,
            NoValidTransitionAvailable,
        ) as ex:
            current_app.logger.exception(ex.msg)
            raise LoanActionError(ex)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )

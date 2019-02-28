# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from __future__ import absolute_import, print_function

import datetime
from functools import wraps

from flask import Blueprint, abort, current_app, request
from invenio_circulation.errors import CirculationException, \
    InvalidCirculationPermission
from invenio_circulation.links import loan_links_factory
from invenio_circulation.views import create_error_handlers
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

    loan_create = LoanCreateResource.as_view(
        LoanCreateResource.view_name,
        serializers=serializers,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "/circulation/loans/create", view_func=loan_create, methods=["POST"]
    )

    multiple_checkout_response_serializer = {
        "application/json": (
            "invenio_app_ils.records.serializers"
            ":json_v1_multiple_checkout_response"
        )
    }

    multiple_checkout_serializer = {
        mime: obj_or_import_string(func)
        for mime, func in multiple_checkout_response_serializer.items()
    }

    multiple_checkout = MultipleCheckoutResource.as_view(
        MultipleCheckoutResource.view_name,
        serializers=multiple_checkout_serializer,
    )

    blueprint.add_url_rule(
        "/circulation/loans/multiple-checkout", view_func=multiple_checkout,
        methods=["POST"]
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


class LoanCreateResource(IlsResource):
    """Loan create action resource also known as Checkout."""

    view_name = "loan_create"

    @need_permissions('circulation-loan-create')
    def post(self, **kwargs):
        """Loan create post method."""
        try:
            pid, loan = create_loan(request.get_json())
        except InvalidCirculationPermission as ex:
            current_app.logger.exception(ex.msg)
            return abort(403)
        except CirculationException as ex:
            current_app.logger.exception(ex.msg)
            return abort(400)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class MultipleCheckoutResource(ContentNegotiatedMethodView):
    """Multiple loan checkout (create) resource."""

    view_name = 'multiple_loan_checkout'

    @need_permissions('circulation-loan-create')
    def post(self, **kwargs):
        """Multiple loan create post method."""
        loans = []
        errors = []
        payload = request.get_json()

        for entry in payload['items']:
            try:
                loan_json = {
                    'item_pid': str(entry['item_pid']),
                    'document_pid': str(entry['document_pid']),
                    'transaction_user_pid':
                        str(payload['transaction_user_pid']),
                    'transaction_location_pid':
                        str(payload['transaction_location_pid']),
                    'patron_pid': str(payload['patron_pid']),
                    'transaction_date':
                        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
                pid, loan = create_loan(loan_json)
                loan['item_barcode'] = entry['barcode']
                loans.append(loan)
            except InvalidCirculationPermission as ex:
                current_app.logger.exception(ex.msg)
                return abort(403)
            except CirculationException as ex:
                current_app.logger.exception(ex.msg)
                errors.append({
                    'error_msg': ex.msg,
                    'error_code': 400,
                    'item_barcode': str(entry['barcode'])

                })
        return self.make_response(
            loans, errors, 202
        )

# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Closure views."""

from flask import Blueprint, abort
from flask_login import current_user
from datetime import date
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView
from invenio_app_ils.locations.api import LOCATION_PID_TYPE
from invenio_app_ils.closures.serializers import closure_periods_response
from invenio_app_ils.closures.api import get_closure_periods
from invenio_app_ils.permissions import backoffice_permission
from invenio_app_ils.records.permissions import RecordPermission


def create_closures_blueprint(app):
    """Create location closed periods blueprint."""
    blueprint = Blueprint("invenio_app_ils_closures", __name__, url_prefix="")
    endpoints = app.config["RECORDS_REST_ENDPOINTS"]

    options = endpoints[LOCATION_PID_TYPE]
    default_media_type = options.get("default_media_type", "")
    closure_periods_serializers = {"application/json": closure_periods_response}

    closure_periods_view = LocationClosurePeriodsResource.as_view(
        LocationClosurePeriodsResource.view_name,
        serializers=closure_periods_serializers,
        default_media_type=default_media_type,
    )
    blueprint.add_url_rule(
        "{0}/closure_periods/<int:year>".format(options["item_route"]),
        view_func=closure_periods_view,
        methods=["GET"],
    )

    return blueprint


class LocationClosurePeriodsResource(ContentNegotiatedMethodView):
    """Returns the closure periods of a Location"""

    view_name = "location_closure_periods"

    @pass_record
    def get(self, pid, record, year, **kwargs):
        """Get the date ranges for which a location is closure based in the specified year"""

        factory = RecordPermission(record, "read")
        if not factory.is_public() and not backoffice_permission().can():
            if not current_user.is_authenticated:
                abort(401)
            abort(403)

        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)

        closure_periods = get_closure_periods(record, start_date, end_date)

        return self.make_response({"closure_periods": closure_periods}, 200)

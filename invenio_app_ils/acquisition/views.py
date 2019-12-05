# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition views."""

from flask import Blueprint
from invenio_rest import ContentNegotiatedMethodView


def create_vendor_blueprint(app):
    """Create a blueprint for Acquisition Vendors actions."""
    blueprint = Blueprint(
        "invenio_app_ils_acquisition_vendors", __name__, url_prefix=""
    )

    return blueprint


class VendorResource(ContentNegotiatedMethodView):
    """Vendor action resource."""

    view_name = "{0}_vendor"

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super(VendorResource, self).__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)

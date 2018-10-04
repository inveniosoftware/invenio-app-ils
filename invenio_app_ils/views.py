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

from functools import wraps

from flask import Blueprint, current_app, render_template
from flask_login import login_required

from invenio_app_ils.permissions import check_permission


def need_permissions(action):
    """View decorator to check permissions for the given action or abort.

    :param action: The action needed.
    """
    def decorator_builder(f):
        @wraps(f)
        def decorate(*args, **kwargs):
            check_permission(
                current_app.config['ILS_VIEWS_PERMISSIONS_FACTORY'](action)
            )
            return f(*args, **kwargs)
        return decorate
    return decorator_builder


main_blueprint = Blueprint(
    "invenio_app_ils_main_ui",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="",
)


@main_blueprint.route("/<path:path>", methods=["GET"])
def index(path):
    """UI base view."""
    return render_template("invenio_app_ils/main.html")


backoffice_blueprint = Blueprint(
    "invenio_app_ils_backoffice_ui",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="/backoffice",
)


@backoffice_blueprint.route("/", methods=["GET"])
@login_required
def backoffice():
    """UI base view."""
    return render_template("invenio_app_ils/backoffice.html")

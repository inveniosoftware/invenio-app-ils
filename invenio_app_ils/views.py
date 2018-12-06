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

from invenio_app_ils.permissions import check_permission
from invenio_app_ils.search.api import ItemSearch


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


main_blueprint = Blueprint(
    "invenio_app_ils_main_ui",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="",
)


@main_blueprint.route("/", methods=["GET"])
@main_blueprint.route("/<path:path>", methods=["GET"])
def index(path=None):
    """UI base view."""
    return render_template("invenio_app_ils/main.html")


@main_blueprint.route('/ping', methods=['HEAD', 'GET'])
def ping():
    """Ping blueprint used by loadbalancer."""
    return 'OK'


backoffice_blueprint = Blueprint(
    "invenio_app_ils_backoffice_ui",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="/backoffice",
)


@backoffice_blueprint.route("/", methods=["GET"])
@backoffice_blueprint.route("/<path:path>", methods=["GET"])
@need_permissions("ils-backoffice-view")
def index(path=None):
    """UI base view."""
    ui_config = {'items': {
        'search': {'sortBy': {'values': [], 'onEmptyQuery': None},
                   'sortOrder': ['asc', 'desc'],
                   'aggs': []}}}
    items_index = ItemSearch.Meta.index

    items_sort = current_app.config.get('RECORDS_REST_SORT_OPTIONS', {}).get(
        items_index, {})
    items_sort_ui = [{
        'field': field,
        'title': items_sort[field]['title'],
        'order': items_sort[field]['order']
    } for field in items_sort.keys()]

    ui_config['items']['search']['sortBy']['values'] = sorted(items_sort_ui,
                                                              key=lambda s: s[
                                                                  'order'])
    if 'mostrecent' in items_sort:
        ui_config['items']['search']['sortBy']['onEmptyQuery'] = 'mostrecent'

    items_aggs = current_app.config.get('RECORDS_REST_FACETS', {}).get(
        items_index, {}).get('aggs', {})
    ui_config['items']['search']['aggs'] = list(items_aggs.keys())

    return render_template("invenio_app_ils/backoffice.html",
                           ui_config=ui_config)

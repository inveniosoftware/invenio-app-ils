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

from flask import Blueprint, current_app, render_template
from invenio_circulation.search.api import LoansSearch

from invenio_app_ils.search.api import ItemSearch

blueprint = Blueprint(
    "invenio_app_ils_ui",
    __name__,
    template_folder="templates",
    static_folder="static",
    url_prefix="",
)


def _get_items_ui_config():
    """Get ui config for items search page."""
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
    ui_config['items']['loanActiveStates'] = current_app.config.get(
        "CIRCULATION_STATES_LOAN_ACTIVE", [])
    return ui_config


def _get_loans_ui_config():
    """Get ui config for loans search page."""
    ui_config = {'loans': {
        'search': {'sortBy': {'values': [], 'onEmptyQuery': None},
                   'sortOrder': ['asc', 'desc'],
                   'aggs': []}}}
    loans_index = LoansSearch.Meta.index

    loans_sort = current_app.config.get('RECORDS_REST_SORT_OPTIONS', {}).get(
        loans_index, {})
    loans_sort_ui = [{
        'field': field,
        'title': loans_sort[field]['title'],
        'order': loans_sort[field]['order']
    } for field in loans_sort.keys()]

    ui_config['loans']['search']['sortBy']['values'] = sorted(loans_sort_ui,
                                                              key=lambda s: s[
                                                                  'order'])
    if 'mostrecent' in loans_sort:
        ui_config['loans']['search']['sortBy']['onEmptyQuery'] = 'mostrecent'

    loans_aggs = current_app.config.get('RECORDS_REST_FACETS', {}).get(
        loans_index, {}).get('aggs', {})
    ui_config['loans']['search']['aggs'] = list(loans_aggs.keys())
    return ui_config


@blueprint.route('/ping', methods=['HEAD', 'GET'])
def ping():
    """Ping blueprint used by loadbalancer."""
    return 'OK'


@blueprint.route("/", methods=["GET"])
@blueprint.route("/<path:path>", methods=["GET"])
def index(path=None):
    """UI base view."""
    ui_config = _get_items_ui_config()
    ui_config.update(_get_loans_ui_config())

    return render_template("invenio_app_ils/index.html", ui_config=ui_config)

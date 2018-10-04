# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Bundles."""

from __future__ import absolute_import, division, print_function

import os

from flask_assets import Bundle
from invenio_assets import NpmBundle

# build main app js bundle
main_js_bundles = os.listdir(
    os.path.join(
        os.path.dirname(__file__), "static", "js", "invenio_app_ils", "main"
    )
)
main_js_bundles = [
    os.path.join("js", "invenio_app_ils", "main", bundle)
    for bundle in main_js_bundles
]

main_js = NpmBundle(
    *main_js_bundles, output="gen/invenio_app_ils.main.%(version)s.js"
)

# main main app css bundle
main_css_bundles = os.listdir(
    os.path.join(
        os.path.dirname(__file__), "static", "css", "invenio_app_ils", "main"
    )
)
main_css_bundles = [
    os.path.join("css", "invenio_app_ils", "main", bundle)
    for bundle in main_css_bundles
]

main_css = Bundle(
    Bundle(*main_css_bundles),
    output="gen/invenio_app_ils.main.%(version)s.css",
)

# build backoffice app js bundle
backoffice_js_bundles = os.listdir(
    os.path.join(
        os.path.dirname(__file__),
        "static",
        "js",
        "invenio_app_ils",
        "backoffice",
    )
)
backoffice_js_bundles = [
    os.path.join("js", "invenio_app_ils", "backoffice", bundle)
    for bundle in backoffice_js_bundles
]

backoffice_js = NpmBundle(
    *backoffice_js_bundles,
    output="gen/invenio_app_ils.backoffice.%(version)s.js"
)

# build backoffice app css bundle
backoffice_css_bundles = os.listdir(
    os.path.join(
        os.path.dirname(__file__),
        "static",
        "css",
        "invenio_app_ils",
        "backoffice",
    )
)
backoffice_css_bundles = [
    os.path.join("css", "invenio_app_ils", "backoffice", bundle)
    for bundle in backoffice_css_bundles
]

backoffice_css = Bundle(
    Bundle(*backoffice_css_bundles),
    output="gen/invenio_app_ils.backoffice.%(version)s.css",
)

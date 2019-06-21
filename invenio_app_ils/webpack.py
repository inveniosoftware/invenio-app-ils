# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""JS/CSS bundles for ILS."""

from __future__ import absolute_import, print_function

from flask_webpackext import WebpackBundle

ils = WebpackBundle(
    __name__,
    'ui/src',
    entry={
        'app_ils': './invenio_app_ils/index.js',
    },
    dependencies={
        "axios": "^0.18.1",
        "lodash": "^4.17.11",
        "luxon": "^1.7.1",
        "node-sass": "^4.10.0",
        "prop-types": "^15.6.2",
        "react": "^16.6.3",
        "react-app-polyfill": "^0.1.3",
        "react-dom": "^16.6.3",
        "react-redux": "^5.1.0",
        "react-router-dom": "^4.3.1",
        "react-scripts": "2.1.1",
        "react-searchkit": "0.4.0",
        "redux": "^4.0.1",
        "redux-thunk": "^2.3.0",
        "semantic-ui-css": "^2.4.1",
        "semantic-ui-react": "^0.83.0",
        "semantic-ui-calendar-react": "^0.15.0",
        "terser": "3.14.1"
    }
)

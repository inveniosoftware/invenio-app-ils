# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""JS/CSS bundles for ILS."""

from __future__ import absolute_import, print_function

from flask_webpackext import WebpackBundle

ils = WebpackBundle(
    __name__,
    "ui/src",
    entry={"app_ils": "./invenio_app_ils/index.js"},
    dependencies={
        "axios": "^0.19.0",
        "formik": "^1.5.8",
        "iso-639-1": "^2.1.0",
        "lodash": "^4.17.15",
        "luxon": "^1.17.2",
        "node-sass": "^4.12.0",
        "prop-types": "^15.7.2",
        "formik": "^1.5.8",
        "qs": "^6.8.0",
        "react": "^16.9.0",
        "react-app-polyfill": "^1.0.2",
        "react-dom": "^16.9.0",
        "react-redux": "^7.1",
        "react-router-dom": "^5.0.1",
        "react-scripts": "3.1.1",
        "react-searchkit": "^0.12.0",
        "redux": "^4.0.4",
        "redux-devtools-extension": "^2.13.8",
        "redux-thunk": "^2.3.0",
        "semantic-ui-calendar-react": "^0.15.3",
        "semantic-ui-css": "^2.4.1",
        "semantic-ui-react": "^0.88.0",
        "yup": "^0.27.0",
    },
)

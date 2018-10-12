#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

pydocstyle invenio_app_ils tests docs && \
isort -rc -c -df && \
# TODO: fix check-manifest and tests, python setup.py dist is checking all node_modules
# even if excluded and slowing down everything
# check-manifest --ignore ".travis-*,docs/_build*" && \
# sphinx-build -qnNW docs docs/_build/html && \
# python setup.py test
pytest tests/

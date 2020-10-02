#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

if [ $# -eq 0 ]; then
    echo "No tests folder provided"
    exit 1
fi

python -m pytest tests/api/$1

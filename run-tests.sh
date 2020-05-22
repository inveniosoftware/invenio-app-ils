#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FOLDER_RELATIVE_PATH=$1
pytest tests/$FOLDER_RELATIVE_PATH

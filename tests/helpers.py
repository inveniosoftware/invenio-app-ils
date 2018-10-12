# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Helpers for tests."""

from __future__ import absolute_import, print_function

import json
import os


def load_json_from_datadir(filename):
    """Load JSON from dir."""
    _data_dir = os.path.join(os.path.dirname(__file__), 'data')
    with open(os.path.join(_data_dir, filename), 'r') as fp:
        return json.load(fp)

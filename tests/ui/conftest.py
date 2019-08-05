# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for the UI application."""

from __future__ import absolute_import, print_function

import os
import sys

import pytest
from invenio_app.factory import create_ui


@pytest.fixture(scope='module')
def create_app():
    """Create test app."""
    return create_ui


@pytest.fixture(scope='module')
def instance_path():
    """Override pytest-invenio fixture."""
    yield os.path.join(sys.prefix, 'var', 'instance')

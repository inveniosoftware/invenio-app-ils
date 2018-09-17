# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils permissions."""

from __future__ import absolute_import, print_function

from invenio_access import action_factory
from invenio_access.permissions import DynamicPermission

action_librarian_access = action_factory('ils-librarian-access')

def librarian_permission_factory():
    """."""
    return DynamicPermission(action_librarian_access)

def has_librarian_permission(loan):
    """."""
    return librarian_permission_factory()
# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils permissions."""

from __future__ import absolute_import, print_function

from flask import abort, g
from flask_login import current_user
from invenio_access import action_factory
from invenio_access.permissions import Permission
from invenio_records_rest.utils import deny_all

librarian_access = action_factory('ils-librarian-access')


def check_permission(permission):
    """Abort if permission is not allowed.

    :param permission: The permission to check.
    """
    if permission is not None and not permission.can():
        if current_user.is_authenticated:
            abort(403, 'You do not have a permission for this action')
        abort(401)


def allow_librarians(*args, **kwargs):
    """Return permission to allow only librarians and admins."""
    return Permission(librarian_access)


def loan_owner(record, *args, **kwargs):
    """Return an object that evaluates if the current user owns the loan."""
    def can(self):
        """Return True if user owns the loan."""
        return allow_librarians(record, *args, **kwargs).can() or \
            record['patron_pid'] == str(g.identity.id)

    return type('LoanOwner', (), {'can': can})()


def login_required(*args, **kwargs):
    """Return an object that evaluates if the current user is authenticated."""
    def can(self):
        """Return True if user is authenticated."""
        return current_user.is_authenticated

    return type('LoginRequired', (), {'can': can})()


def views_permissions_factory(action):
    """Default ILS views permissions factory."""
    if action == 'circulation-loan-request':
        return login_required()
    else:
        return deny_all()

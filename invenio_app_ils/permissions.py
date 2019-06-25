# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils permissions."""

from __future__ import absolute_import, print_function

from flask import abort
from flask_login import current_user
from flask_principal import UserNeed
from invenio_access import action_factory
from invenio_access.permissions import Permission, authenticated_user
from invenio_records_rest.utils import deny_all

backoffice_access_action = action_factory("ils-backoffice-access")


def check_permission(permission):
    """Abort if permission is not allowed.

    :param permission: The permission to check.
    """
    if permission is not None and not permission.can():
        if not current_user.is_authenticated:
            abort(401)
        abort(403)


def backoffice_permission(*args, **kwargs):
    """Return permission to allow only librarians and admins."""
    return Permission(backoffice_access_action)


class LoanOwnerPermission(Permission):
    """Return Permission to evaluate if the current user owns the loan."""

    def __init__(self, record):
        """Constructor."""
        super(LoanOwnerPermission, self).__init__(
            UserNeed(int(record['patron_pid'])),
            backoffice_access_action
        )


def authenticated_user_permission(*args, **kwargs):
    """Return an object that evaluates if the current user is authenticated."""
    return Permission(authenticated_user)


def views_permissions_factory(action):
    """Return ILS views permissions factory."""
    if action == "circulation-loan-request":
        return authenticated_user_permission()
    elif action == "circulation-loan-create":
        return backoffice_permission()
    else:
        return deny_all()


def circulation_status_permission(patron_pid):
    """Return circulation status permission for a patron."""
    return Permission(UserNeed(int(patron_pid)), backoffice_access_action)

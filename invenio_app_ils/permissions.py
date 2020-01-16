# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils permissions."""

from __future__ import absolute_import, print_function

from functools import wraps

from flask import abort, current_app
from flask_login import current_user
from flask_principal import UserNeed
from invenio_access import action_factory
from invenio_access.permissions import Permission, authenticated_user
from invenio_records_rest.utils import allow_all, deny_all

from invenio_app_ils.proxies import current_app_ils

backoffice_access_action = action_factory("ils-backoffice-access")


def need_permissions(action):
    """View decorator to check permissions for the given action or abort.

    :param action: The action needed.
    """
    def decorator_builder(f):
        @wraps(f)
        def decorate(*args, **kwargs):
            check_permission(
                current_app.config["ILS_VIEWS_PERMISSIONS_FACTORY"](action)
            )
            return f(*args, **kwargs)

        return decorate

    return decorator_builder


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


def file_download_permission(obj):
    """File download permissions."""
    bucket_id = str(obj.bucket_id)
    search_cls = current_app_ils.eitem_search_cls
    results = search_cls().search_by_bucket_id(bucket_id)
    if len(results) != 1:
        return deny_all()

    eitem_cls = current_app_ils.eitem_record_cls
    record = eitem_cls.get_record_by_pid(results[0].pid)
    if record.get("open_access", False):
        return allow_all()
    return authenticated_user_permission()


def files_permission(obj, action=None):
    """Return permission for Files REST."""
    if action == "object-read":
        return file_download_permission(obj)
    return backoffice_permission()


class LoanOwnerPermission(Permission):
    """Return Permission to evaluate if the current user owns the loan."""

    def __init__(self, record):
        """Constructor."""
        super(LoanOwnerPermission, self).__init__(
            UserNeed(int(record["patron_pid"])), backoffice_access_action
        )


class DocumentRequestOwnerPermission(Permission):
    """Return Permission to evaluate if the current user owns the request."""

    def __init__(self, record):
        """Constructor."""
        super(DocumentRequestOwnerPermission, self).__init__(
            UserNeed(int(record["patron_pid"])), backoffice_access_action
        )


def authenticated_user_permission(*args, **kwargs):
    """Return an object that evaluates if the current user is authenticated."""
    return Permission(authenticated_user)


def views_permissions_factory(action):
    """Return ILS views permissions factory."""
    if action == "circulation-loan-request":
        return authenticated_user_permission()
    elif action == "circulation-loan-checkout":
        return backoffice_permission()
    elif action == "circulation-loan-force-checkout":
        return backoffice_permission()
    elif action == "circulation-overdue-loan-email":
        return backoffice_permission()
    elif action == "relations-create":
        return backoffice_permission()
    elif action == "relations-delete":
        return backoffice_permission()
    elif action == "stats-most-loaned":
        return backoffice_permission()
    elif action == "document-request-accept":
        return backoffice_permission()
    elif action == "document-request-pending":
        return backoffice_permission()
    elif action == "document-request-reject":
        return backoffice_permission()
    elif action == "bucket-create":
        return backoffice_permission()
    else:
        return deny_all()


def circulation_permission(patron_pid):
    """Return circulation status permission for a patron."""
    return Permission(UserNeed(int(patron_pid)), backoffice_access_action)

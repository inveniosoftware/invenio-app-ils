# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils permissions."""

from functools import wraps

from flask import abort, current_app
from flask_login import current_user
from flask_principal import UserNeed
from invenio_access import action_factory
from invenio_access.permissions import Permission, authenticated_user, \
    superuser_access
from invenio_records_rest.utils import allow_all, deny_all

from invenio_app_ils.errors import InvalidLoanExtendError
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


def authenticated_user_permission(*args, **kwargs):
    """Return an object that evaluates if the current user is authenticated."""
    return Permission(authenticated_user)


def backoffice_permission(*args, **kwargs):
    """Return permission to allow only librarians and admins."""
    return Permission(backoffice_access_action)


def superuser_permission(*args, **kwargs):
    """Return permission to allow only admins."""
    return Permission(superuser_access)


def patron_permission(patron_pid):
    """Return a permission for the given patron."""
    return Permission(UserNeed(int(patron_pid)), backoffice_access_action)


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


def loan_extend_circulation_permission(loan):
    """Return permission to allow only owner and librarians to extend loan."""
    if not current_user or not current_user.id:
        abort(401)

    if current_user.id == int(loan["patron_pid"]):
        Document = current_app_ils.document_record_cls
        document_rec = Document.get_record_by_pid(loan["document_pid"])
        document = document_rec.replace_refs()
        is_overbooked = document.get("circulation", {}).get("overbooked")
        if is_overbooked is None:
            # NOTE: this should never happen, if it happens it means that the
            # document does not have `circulation.overbooked` field. Fix it!
            abort(500)
        elif is_overbooked:
            raise InvalidLoanExtendError(
                "The extension cannot be automatically accepted due to high "
                "demand for this literature. Please contact the library to "
                "request a loan extension."
            )
    return PatronOwnerPermission(loan)


class PatronOwnerPermission(Permission):
    """Return Permission to evaluate if the current user owns the record."""

    def __init__(self, record):
        """Constructor."""
        super(PatronOwnerPermission, self).__init__(
            UserNeed(int(record["patron_pid"])), backoffice_access_action
        )


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
    elif action == "document-request-actions":
        return backoffice_permission()
    elif action == "document-request-decline":
        # return a factory that accepts a record as parameter
        return PatronOwnerPermission
    elif action == "bucket-create":
        return backoffice_permission()
    elif action == "ill-brwreq-patron-loan-create":
        return backoffice_permission()
    elif action == "ill-brwreq-patron-loan-extension-request":
        # return a factory that accepts a record as parameter
        return PatronOwnerPermission
    elif action == "ill-brwreq-patron-loan-extension-accept":
        return backoffice_permission()
    elif action == "ill-brwreq-patron-loan-extension-decline":
        return backoffice_permission()
    return deny_all()

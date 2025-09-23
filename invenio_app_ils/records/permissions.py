# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS records permissions."""

from flask import current_app
from flask_principal import ActionNeed, RoleNeed, UserNeed
from invenio_access import Permission, any_user
from six import string_types

from invenio_app_ils.permissions import (
    backoffice_access_action,
    backoffice_readonly_access_action,
)

create_records_action = ActionNeed("create-records")


def record_create_permission_factory(record=None):
    """Record create permission factory."""
    return RecordPermission(record=record, action="create")


def record_update_permission_factory(record=None):
    """Record update permission factory."""
    return RecordPermission(record=record, action="update")


def record_delete_permission_factory(record=None):
    """Record delete permission factory."""
    return RecordPermission(record=record, action="delete")


def record_read_permission_factory(record=None):
    """Record read permission factory."""
    return RecordPermission(record=record, action="read")


class RecordPermission(Permission):
    """Record permission.

    - Create action given to librarian, admin and specified users.
    - Read access given to everyone with possibility to hide.
    - Delete access to admin and specified users.
    """

    def __init__(self, record, action):
        """Constructor."""
        self.record = record
        self.current_action = action
        record_needs = self.collect_needs()
        super().__init__(*record_needs)

    def collect_needs(self):
        """Collect permission policy per action."""
        if self.current_action == "read":
            return self.read_permissions()
        elif self.current_action == "create":
            return [create_records_action, backoffice_access_action]
        elif self.current_action == "update":
            return self.record_needs() + [backoffice_access_action]
        else:
            return self.record_needs()

    def read_permissions(self):
        """Define read permission policy per record."""
        if self.is_public():
            return [any_user]
        else:
            return self.record_needs() + [
                backoffice_readonly_access_action,
                backoffice_access_action,
            ]

    def record_explicit_restrictions(self):
        """Return the list of user ids/roles allowed for the given action."""
        if current_app.config.get("ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"):
            return self.record.get("_access", {}).get(self.current_action, [])
        return []

    def record_needs(self):
        """Create needs of the record."""
        needs = []
        for access_entity in self.record_explicit_restrictions():
            try:
                if isinstance(access_entity, string_types):
                    needs.append(UserNeed(int(access_entity)))
                elif isinstance(access_entity, int):
                    needs.append(UserNeed(access_entity))
            except ValueError:
                needs.append(RoleNeed(access_entity.lower()))
        return needs

    def is_public(self):
        """Check if the record is fully public.

        Explicit permission = `_access` field
        Implicit permission = `restricted` field
        Explicit, when defined, takes precedence over implicit which is
        ignored.
        The record is public when `_access.read` is not defined and
        `restricted` is False.
        """
        has_explicit_perm = current_app.config.get(
            "ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"
        ) and self.record.get("_access", {}).get("read", [])
        if not has_explicit_perm:
            return self.record.get("restricted", False) is False
        return False

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record permissions."""

from __future__ import unicode_literals

import uuid

import pytest
from flask_principal import RoleNeed, identity_loaded
from flask_security import login_user
from invenio_access.models import ActionRoles
from invenio_accounts.models import Role, User
from invenio_records.api import Record

from invenio_app_ils.records.permissions import RecordPermission, \
    create_records_action


@pytest.mark.parametrize(
    "access,action,is_allowed",
    [
        ({"foo": "bar"}, "read", True),
        ({"foo": "bar"}, "update", False),
        ({"_access": {"read": [1]}}, "read", True),
        ({"_access": {"read": [2]}}, "read", False),
        ({"_access": {"read": ["records-readers"]}}, "read", True),
        # permission for specific user to create
        ({"_access": {"update": [1]}}, "update", True),
        # checks if the access works for different actions
        ({"_access": {"update": [1]}}, "create", False),
        ({"_access": {"delete": [1]}}, "update", False),
        # delete access for user and librarian
        ({"_access": {"delete": [1, "librarian"]}}, "delete", True),
    ],
)
def test_record_generic_access(db, users, with_access, access, action,
                               is_allowed):
    """Test access control for records."""

    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed("records-readers")]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    def login_and_test(user_id):
        login_user(User.query.get(user_id))
        # Create record
        user = User.query.get(user_id)
        id = uuid.uuid4()
        record = Record.create(access, id_=id)
        factory = RecordPermission(record, action)
        if user.has_role("admin"):
            # super user can do EVERYTHING
            assert factory.can()
        elif user.has_role("librarian") and action != "delete":
            # librarian should be able to update, create, and read everything
            assert factory.can()
        else:
            assert factory.can() if is_allowed else not factory.can()

    # Test standard user
    login_and_test(users["patron1"].id)
    # Test librarian access
    login_and_test(users["librarian"].id)
    # Test superuser access
    login_and_test(users["admin"].id)


@pytest.mark.parametrize(
    "access,action,is_allowed",
    [
        ({"foo": "bar"}, "create", True),
        ({"foo": "bar"}, "update", False),
        ({"foo": "bar"}, "delete", False),
    ],
)
def test_record_patron_create(db, users, access, action, is_allowed):
    """Test patron create."""
    # create role to be able to create records
    role = Role(name="records-creators")
    db.session.add(role)
    db.session.commit()
    # assign role to the action "create-records"
    ar = ActionRoles.allow(create_records_action, role_id=role.id)
    db.session.add(ar)
    db.session.commit()

    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed(role.name)]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    login_user(users["patron1"])

    id = uuid.uuid4()
    record = Record.create(access, id_=id)
    factory = RecordPermission(record, action)

    assert factory.can() if is_allowed else not factory.can()

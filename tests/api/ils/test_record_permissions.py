# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record permissions."""

import uuid

import pytest
from flask_principal import RoleNeed, identity_loaded
from invenio_access.models import ActionRoles
from invenio_accounts.models import Role
from invenio_records.api import Record
from tests.helpers import user_login

from invenio_app_ils.records.permissions import RecordPermission, \
    create_records_action


@pytest.mark.skip("Temporarily disabled, please fix me")
def test_record_generic_access(client, db, users, with_access):
    """Test access control for records."""

    tests = [
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
    ]

    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed("records-readers")]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    def login_and_test(username):
        user = user_login(client, username, users)
        # Create record
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

    for access, action, is_allowed in tests:
        # Test standard user
        login_and_test("patron1")
        # Test librarian access
        login_and_test("librarian")
        # Test superuser access
        login_and_test("admin")


@pytest.mark.skip("Temporarily disabled, please fix me")
def test_record_patron_create(client, db, users):
    """Test patron create."""

    tests = [
        ({"foo": "bar"}, "create", True),
        ({"foo": "bar"}, "update", False),
        ({"foo": "bar"}, "delete", False),
    ]

    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed(role.name)]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    for access, action, is_allowed in tests:
        # create role to be able to create records
        role = Role(name="records-creators")
        db.session.add(role)
        db.session.commit()
        # assign role to the action "create-records"
        ar = ActionRoles.allow(create_records_action, role_id=role.id)
        db.session.add(ar)
        db.session.commit()

        user_login(client, "patron1", users)

        id = uuid.uuid4()
        record = Record.create(access, id_=id)
        factory = RecordPermission(record, action)

        assert factory.can() if is_allowed else not factory.can()

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Test record permissions."""
from __future__ import unicode_literals

import uuid

import pytest
from flask_principal import ActionNeed, RoleNeed, identity_loaded
from flask_security import login_user
from invenio_accounts.models import User
from invenio_records.api import Record

from invenio_app_ils.records.permissions import RecordPermission


@pytest.mark.parametrize('access,action,is_allowed', [
    ({'foo': 'bar'}, 'read', True),     # default cases
    ({'foo': 'bar'}, 'update', False),
    ({'_access': {'read': [1, 'no-access@invenio',
                           'no-access-either@invenio']}}, 'read', True),
    ({'_access': {'read': [2, 'no-access@invenio']}}, 'read', False),
    ({'_access': {'read': ['test@invenio']}}, 'read', True),
    # permission for specific user to create
    ({'_access': {'update': [1]}}, 'update', True),
    # checks if the access works for different actions
    ({'_access': {'update': [1]}}, 'create', False),
    ({'_access': {'delete': [1]}}, 'update', False),

    # delete access for user and librarian
    ({'_access': {'delete': [1, 'librarian']}}, 'delete', True),

])
def test_record_generic_access(db, users, access, action, is_allowed):
    """Test access control for records."""

    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed('test@invenio')]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    def login_and_test(user_id):
        login_user(User.query.get(user_id))
        # Create record
        user = User.query.get(user_id)
        id = uuid.uuid4()
        record = Record.create(access, id_=id)
        factory = RecordPermission(record, action)
        if user.has_role('admin'):
            # super user can do EVERYTHING
            assert factory.can()
        elif user.has_role('librarian') and action != 'delete':
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


@pytest.mark.parametrize('access,action,is_allowed', [
    ({'foo': 'bar'}, 'update', True),
    ({'foo': 'bar'}, 'delete', False),
    ({'_access': {'delete': ['librarian']}}, 'delete', True),
    ({'_access': {'delete': ['1']}}, 'delete', False),
    ({'_access': {'update': ['1']}}, 'update', True),
])
def test_record_librarian_access(db, users, access, action, is_allowed):
    """Test Librarian access."""
    login_user(users["librarian"])
    id = uuid.uuid4()
    record = Record.create(access, id_=id)
    factory = RecordPermission(record, action)
    assert factory.can() if is_allowed else not factory.can()


@pytest.mark.parametrize('access,action,is_allowed', [
    ({'foo': 'bar'}, 'update', False),
    ({'foo': 'bar'}, 'delete', False),
    ({'_access': {'delete': [1]}}, 'delete', True),
    ({'_access': {'update': [1]}}, 'update', True),
    ({'_access': {'update': ['1']}}, 'update', True),
    ({'_access': {'update': ['1']}}, 'delete', False),
])
def test_record_patron_access(db, users, access, action, is_allowed):
    """Test patron access."""
    login_user(users["patron1"])
    id = uuid.uuid4()
    record = Record.create(access, id_=id)
    factory = RecordPermission(record, action)
    assert factory.can() if is_allowed else not factory.can()


@pytest.mark.parametrize('access,action,is_allowed', [
    ({'foo': 'bar'}, 'create', True),
    ({'foo': 'bar'}, 'update', False),
    ({'foo': 'bar'}, 'delete', False),
])
def test_record_patron_create(db, users, access, action, is_allowed):
    """Test patron create."""
    @identity_loaded.connect
    def mock_identity_provides(sender, identity):
        """Provide additional role to the user."""
        roles = [ActionNeed('create-records')]
        # Gives the user additional roles, f.e. based on his groups
        identity.provides |= set(roles)

    login_user(users["patron1"])

    id = uuid.uuid4()
    record = Record.create(access, id_=id)
    factory = RecordPermission(record, action)

    assert factory.can() if is_allowed else not factory.can()

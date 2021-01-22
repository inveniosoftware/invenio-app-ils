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
from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import UnauthorizedSearchError
from invenio_app_ils.records.permissions import (
    RecordPermission,
    create_records_action,
)
from invenio_app_ils.search_permissions import _filter_by_patron
from tests.helpers import user_login


@pytest.mark.parametrize(
    "patron_pid,qs,should_raise",
    [
        ("1", None, False),
        ("1", "", False),
        ("1", "pid:1234", False),
        ("1", "patron_pid:2", True),
        ("1", "patron_pid: 2", True),
        ("1", "patron_pid: '2'", False),
        ("1", "pid:1234 AND patron_pid:2", True),
    ],
)
def test_filter_by_patron(app, patron_pid, qs, should_raise):
    """Test the function filter_by_patron."""
    search = RecordsSearch()
    if should_raise:
        with pytest.raises(UnauthorizedSearchError):
            _filter_by_patron(patron_pid, search, qs)
    else:
        _search, _qs = _filter_by_patron(patron_pid, search, qs)
        term = _search.to_dict()["query"]["bool"]["filter"][0]["term"]
        assert term == {"patron_pid": patron_pid}


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
    def add_roles_to_identity(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed("records-readers")]
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


@pytest.fixture()
def with_role_creator(db):
    """"Create a new role and assign action."""
    role = Role(name="records-creators")
    db.session.add(role)
    db.session.commit()
    # assign role to the action "create-records"
    ar = ActionRoles.allow(create_records_action, role_id=role.id)
    db.session.add(ar)
    db.session.commit()


def test_record_patron_create(client, db, users, with_role_creator):
    """Test patron create."""

    tests = [
        ({"foo": "bar"}, "create", True),
        ({"foo": "bar"}, "update", False),
        ({"foo": "bar"}, "delete", False),
    ]

    @identity_loaded.connect
    def add_roles_to_identity(sender, identity):
        """Provide additional role to the user."""
        roles = [RoleNeed("records-creators")]
        identity.provides |= set(roles)

    for access, action, is_allowed in tests:
        # create role to be able to create records
        user_login(client, "patron1", users)

        id = uuid.uuid4()
        record = Record.create(access, id_=id)
        factory = RecordPermission(record, action)

        assert factory.can() if is_allowed else not factory.can()

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Common pytest fixtures and plugins."""

import pytest
from invenio_access.models import ActionRoles
from invenio_access.permissions import superuser_access
from invenio_accounts.models import Role

from invenio_app_ils.permissions import backoffice_access_action


@pytest.fixture()
def users(app, db):
    """Create admin, librarians and patrons."""
    with db.session.begin_nested():
        datastore = app.extensions['security'].datastore
        # create users
        patron1 = datastore.create_user(email='patron1@test.com',
                                        password='123456', active=True)
        patron2 = datastore.create_user(email='patron2@test.com',
                                        password='123456', active=True)
        patron3 = datastore.create_user(email='patron3@test.com',
                                        password='123456', active=True)
        librarian = datastore.create_user(email='librarian@test.com',
                                          password='123456', active=True)
        librarian2 = datastore.create_user(email='librarian2@test.com',
                                           password='123456', active=True)
        admin = datastore.create_user(email='admin@test.com',
                                      password='123456', active=True)
        # Give role to admin
        admin_role = Role(name='admin')
        db.session.add(ActionRoles(action=superuser_access.value,
                                   role=admin_role))
        datastore.add_role_to_user(admin, admin_role)
        # Give role to librarian
        librarian_role = Role(name='librarian')
        db.session.add(ActionRoles(action=backoffice_access_action.value,
                                   role=librarian_role))
        datastore.add_role_to_user(librarian, librarian_role)
        # Give role to librarian2
        db.session.add(ActionRoles(action=backoffice_access_action.value,
                                   role=librarian_role))
        datastore.add_role_to_user(librarian2, librarian_role)
    db.session.commit()

    return {
        'admin': admin,
        'librarian': librarian,
        'librarian2': librarian2,
        'patron1': patron1,
        'patron2': patron2,
        'patron3': patron3,
    }

# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Common pytest fixtures and plugins."""

import os

import jinja2
import pytest
from flask import Blueprint
from invenio_access.models import ActionRoles
from invenio_access.permissions import superuser_access
from invenio_accounts.models import Role

from invenio_app_ils.permissions import backoffice_access_action


@pytest.fixture()
def users(app, db):
    """Create admin, librarians and patrons."""
    # with Postgresql, when dropping the User table, the sequence is not
    # automatically reset to 1, causing issues with the tests demo data.
    db.session.execute("ALTER SEQUENCE IF EXISTS accounts_user_id_seq RESTART")
    db.session.commit()

    with db.session.begin_nested():
        datastore = app.extensions["security"].datastore
        # create users
        patron1 = datastore.create_user(
            email="patron1@test.com", password="123456", active=True
        )
        patron2 = datastore.create_user(
            email="patron2@test.com", password="123456", active=True
        )
        patron3 = datastore.create_user(
            email="patron3@test.com", password="123456", active=True
        )
        librarian = datastore.create_user(
            email="librarian@test.com", password="123456", active=True
        )
        librarian2 = datastore.create_user(
            email="librarian2@test.com", password="123456", active=True
        )
        admin = datastore.create_user(
            email="admin@test.com", password="123456", active=True
        )
        # Give role to admin
        admin_role = Role(name="admin")
        db.session.add(
            ActionRoles(action=superuser_access.value, role=admin_role)
        )
        datastore.add_role_to_user(admin, admin_role)
        # Give role to librarian
        librarian_role = Role(name="librarian")
        db.session.add(
            ActionRoles(
                action=backoffice_access_action.value, role=librarian_role
            )
        )
        datastore.add_role_to_user(librarian, librarian_role)
        # Give role to librarian2
        db.session.add(
            ActionRoles(
                action=backoffice_access_action.value, role=librarian_role
            )
        )
        datastore.add_role_to_user(librarian2, librarian_role)
    db.session.commit()

    return {
        "admin": admin,
        "librarian": librarian,
        "librarian2": librarian2,
        "patron1": patron1,
        "patron2": patron2,
        "patron3": patron3,
    }


@pytest.fixture(scope="module")
def app_with_mail(app):
    """App with email test templates."""
    app.register_blueprint(
        Blueprint(
            "invenio_app_ils_tests", __name__, template_folder="templates"
        )
    )
    # add extra test templates to the search app blueprint, to fake the
    # existence of `invenio-theme` base templates.
    test_templates_path = os.path.join(os.path.dirname(__file__), "templates")
    enhanced_jinja_loader = jinja2.ChoiceLoader(
        [
            app.jinja_loader,
            jinja2.FileSystemLoader(test_templates_path),
        ]
    )
    # override default app jinja_loader to add the new path
    app.jinja_loader = enhanced_jinja_loader
    yield app

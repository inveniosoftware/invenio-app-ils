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
from flask_webpackext.manifest import (
    JinjaManifest,
    JinjaManifestEntry,
    JinjaManifestLoader,
)
from invenio_access.models import ActionRoles
from invenio_access.permissions import superuser_access
from invenio_accounts.models import Role
from invenio_app.factory import create_app as _create_app
from invenio_userprofiles import UserProfile

from invenio_app_ils.permissions import backoffice_access_action


#
# Mock the webpack manifest to avoid having to compile the full assets.
#
class MockJinjaManifest(JinjaManifest):
    """Mock manifest."""

    def __getitem__(self, key):
        """Get a manifest entry."""
        return JinjaManifestEntry(key, [key])

    def __getattr__(self, name):
        """Get a manifest entry."""
        return JinjaManifestEntry(name, [name])


class MockManifestLoader(JinjaManifestLoader):
    """Manifest loader creating a mocked manifest."""

    def load(self, filepath):
        """Load the manifest."""
        return MockJinjaManifest()


@pytest.fixture(scope="module")
def app_config(app_config):
    """Create test app."""
    app_config["WEBPACKEXT_MANIFEST_LOADER"] = MockManifestLoader
    return app_config


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
        db.session.add(ActionRoles(action=superuser_access.value, role=admin_role))
        datastore.add_role_to_user(admin, admin_role)
        # Give role to librarian
        librarian_role = Role(name="librarian")
        db.session.add(
            ActionRoles(action=backoffice_access_action.value, role=librarian_role)
        )
        datastore.add_role_to_user(librarian, librarian_role)
        # Give role to librarian2
        db.session.add(
            ActionRoles(action=backoffice_access_action.value, role=librarian_role)
        )
        datastore.add_role_to_user(librarian2, librarian_role)
    db.session.commit()

    for patron, name in [
        (admin, "Admin User"),
        (librarian, "Librarian One"),
        (librarian2, "Librarian Two"),
        (patron1, "Patron One"),
        (patron2, "Patron Two"),
        (patron3, "Patron Three"),
    ]:
        profile = UserProfile(
            **dict(
                user_id=patron.id,
                _displayname="id_" + str(patron.id),
                full_name=name,
            )
        )
        db.session.add(profile)
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
def app_with_notifs(app):
    """App with notifications test templates."""
    app.register_blueprint(
        Blueprint("invenio_app_ils_tests", __name__, template_folder="templates")
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


@pytest.fixture(scope="module")
def create_app():
    """Create test app."""
    return _create_app


@pytest.fixture(scope="module")
def base_app(create_app, app_config, request, default_handler):
    """Base application fixture (without database, search and cache).

    Scope: module.

    This fixture is responsible for creating the Invenio application. It
    depends on an application factory fixture that must be defined by the user.

    .. code-block:: python

        # confest.py
        import pytest

        @pytest.fixture(scope='module)
        def create_app():
            from invenio_app.factory import create_api
            return create_api

    It is possible to overide the application factory for a specific test
    module, either by defining a fixture like above example, or simply setting
    the ``create_app`` property on the module:

    .. code-block:: python

        # test_something.py

        from invenio_app.factory import create_api
        create_app = create_api

        def test_acase(base_app):
            # ...
    """
    # Use create_app from the module if defined, otherwise use default
    # create_app fixture.
    create_app = getattr(request.module, "create_app", create_app)
    app_ = create_app(**app_config)

    def delete_user_from_g(exception):
        """Delete user from `flask.g` when the request is tearing down.

        Flask-login==0.6.2 changed the way the user is saved i.e uses `flask.g`.
        Flask.g is pointing to the application context which is initialized per
        request. That said, `pytest-flask` is pushing an application context on each
        test initialization that causes problems as subsequent requests during a test
        are detecting the active application request and not popping it when the
        sub-request is tearing down. That causes the logged in user to remain cached
        for the whole duration of the test. To fix this, we add an explicit teardown
        handler that will pop out the logged in user in each request and it will force
        the user to be loaded each time.
        """
        from flask import g

        if "_login_user" in g:
            del g._login_user

    app_.teardown_request(delete_user_from_g)

    # See documentation for default_handler
    if default_handler:
        app_.logger.addHandler(default_handler)
    yield app_

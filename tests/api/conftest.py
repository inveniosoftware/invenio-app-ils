# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for the API application."""

from __future__ import absolute_import, print_function

import json
import os

import pytest
from invenio_app.factory import create_api
from invenio_access.models import ActionRoles
from invenio_access.permissions import superuser_access
from invenio_accounts.models import Role, User
from invenio_circulation.api import Loan
from invenio_db import db
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.api import Document, Item, Location
from invenio_app_ils.permissions import librarian_access

from .helpers import mint_record_pid


@pytest.fixture(scope="module")
def app_config(app_config):
    """Flask application fixture."""
    app_config['APP_DEFAULT_SECURE_HEADERS']['session_cookie_secure'] = False
    app_config['APP_DEFAULT_SECURE_HEADERS']['content_security_policy'] = {
        'default-src': []
    }
    return app_config


@pytest.fixture(scope='module')
def create_app():
    """Create test app."""
    return create_api


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
        librarian = datastore.create_user(email='librarian@test.com',
                                          password='123456', active=True)
        admin = datastore.create_user(email='admin@test.com',
                                      password='123456', active=True)
        # Give role to admin
        admin_role = Role(name='admin')
        db.session.add(ActionRoles(
            action=superuser_access.value, role=admin_role))
        datastore.add_role_to_user(admin, admin_role)
        # Give role to librarian
        librarian_role = Role(name='librarian')
        db.session.add(ActionRoles(
            action=librarian_access.value, role=librarian_role))
        datastore.add_role_to_user(librarian, librarian_role)
    db.session.commit()

    return {
        'admin': admin,
        'librarian': librarian,
        'patron1': patron1,
        'patron2': patron2,
    }


@pytest.fixture()
def json_headers(app):
    """JSON headers."""
    return [('Content-Type', 'application/json'),
            ('Accept', 'application/json')]


@pytest.fixture()
def datadir():
    """Get data directory."""
    return os.path.join(os.path.dirname(__file__), '..', 'data')


@pytest.fixture()
def documents(datadir):
    """Get documents."""
    with open(os.path.join(datadir, 'documents.json'), 'r') as fp:
        yield json.load(fp)


@pytest.fixture()
def items(datadir):
    """Get items."""
    with open(os.path.join(datadir, 'items.json'), 'r') as fp:
        yield json.load(fp)


@pytest.fixture()
def locations(datadir):
    """Get locations."""
    with open(os.path.join(datadir, 'locations.json'), 'r') as fp:
        yield json.load(fp)


@pytest.fixture()
def loans(datadir):
    """Get loans."""
    with open(os.path.join(datadir, 'loans.json'), 'r') as fp:
        yield json.load(fp)


@pytest.fixture()
def testdata(app, db, documents, items, locations, loans):
    """Insert and return test data."""
    indexer = RecordIndexer()
    for location in locations:
        record = Location.create(location)
        mint_record_pid('locid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for doc in documents:
        record = Document.create(doc)
        mint_record_pid('docid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for item in items:
        record = Item.create(item)
        mint_record_pid('itemid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for loan in loans:
        record = Loan.create(loan)
        mint_record_pid('loanid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    return {
        'locations': locations,
        'documents': documents,
        'items': items,
        'loans': loans
    }

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS"""

import os

from setuptools import find_packages, setup

readme = open("README.rst").read()

tests_require = [
    "check-manifest>=0.35",
    "coverage>=4.4.1",
    "isort>=4.3.11",
    "mock>=2.0.0",
    "pydocstyle>=2.0.0",
    "pytest-cov>=2.5.1",
    "pytest-invenio>=1.0.5,<1.1.0",
    "pytest-mock>=1.6.0",
    "pytest-pep8>=1.0.6",
    "pytest-random-order>=0.5.4",
    "pytest>=3.8.1,<4",
]

extras_require = {
    "docs": ["Sphinx>=1.5.1"],
    "lorem": ["lorem>=0.1.1 "],
    "tests": tests_require,
}

extras_require["all"] = []
for reqs in extras_require.values():
    extras_require["all"].extend(reqs)

setup_requires = ["Babel>=2.4.0", "pytest-runner>=3.0.0,<5"]

install_requires = [
    "Flask-BabelEx>=0.9.3",
    "Flask-Debugtoolbar>=0.10.1",
    "invenio[postgresql,base,auth]==3.1.0.dev20181106",
    # extra invenio-search
    'invenio-search[elasticsearch6]>=1.1.0,<1.2.0',
    # metadata bundle without records UI
    "invenio-indexer>=1.0.1,<1.1.0",
    "invenio-jsonschemas>=1.0.0,<1.1.0",
    "invenio-oaiserver>=1.0.0,<1.1.0",
    "invenio-pidstore>=1.0.0,<1.1.0",
    "invenio-records-rest>=1.3.0,<1.4.0",
    "invenio-records>=1.0.0,<1.1.0",
    # upgraded packages
    "invenio-accounts-rest>=1.0.0a4,<1.1.0",
    "invenio-app>=1.0.4,<1.1.0",
    "invenio-assets>=1.1.1,<1.2.0",
    "invenio-i18n>=1.1.0,<1.2.0",
    "invenio-userprofiles>=1.0.1,<1.1.0",
    "invenio-search>=1.1.0,<1.2.0",
    # because of https://github.com/requests/requests-oauthlib/commit/1b9fe1a630eb1c91bf12fd70aa2e10ca74ffc0b6
    "oauthlib>=2.1.0,<3.0.0",
    # https://github.com/inveniosoftware/invenio-indexer/commit/9749c2fe4e2cbaabc167ad7fb12ade945a2d580c
    "redis>=2.10.0,<3.0.0",
    # extra
    "invenio-circulation>=1.0.0a11,<1.1.0",
    "invenio-records-editor>=1.0.0a3,<1.1.0",
    # until flask-sqlalchemy is fixed
    "SQLAlchemy>=1.2.16,<1.3.0"
]

packages = find_packages()


# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join("invenio_app_ils", "version.py"), "rt") as fp:
    exec(fp.read(), g)
    version = g["__version__"]

setup(
    name="invenio_app_ils",
    version=version,
    description=__doc__,
    long_description=readme,
    keywords="invenio_app_ils Invenio",
    license="MIT",
    author="CERN",
    author_email="info@inveniosoftware.org",
    url="https://github.com/invenio_app_ils/invenio_app_ils",
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms="any",
    entry_points={
        "console_scripts": ["ils = invenio_app.cli:cli"],
        "flask.commands": ["demo = invenio_app_ils.cli:demo"],
        "invenio_base.apps": [
            "invenio_app_ils_ui = invenio_app_ils.ext:InvenioAppIlsUI"
        ],
        "invenio_base.api_apps": [
            "invenio_app_ils_rest = invenio_app_ils.ext:InvenioAppIlsREST"
        ],
        "invenio_base.blueprints": [
            "invenio_app_ils_ui = invenio_app_ils.views:blueprint",
        ],
        "invenio_base.api_blueprints": [
            "invenio_app_ils_circulation = "
            "invenio_app_ils.circulation.views:create_circulation_blueprint"
        ],
        "invenio_config.module": [
            "00_invenio_app_ils = invenio_app_ils.config"
        ],
        "invenio_assets.webpack": [
            "invenio_app_ils = invenio_app_ils.webpack:ils"
        ],
        "invenio_i18n.translations": ["messages = invenio_app_ils"],
        "invenio_jsonschemas.schemas": [
            "ils_schemas = invenio_app_ils.schemas"
        ],
        "invenio_search.mappings": [
            "documents = invenio_app_ils.mappings",
            "items = invenio_app_ils.mappings",
            "locations = invenio_app_ils.mappings",
            "internal_locations = invenio_app_ils.mappings",
            "keywords = invenio_app_ils.mappings",
        ],
        "invenio_pidstore.fetchers": [
            "docid = invenio_app_ils.pidstore.fetchers:document_pid_fetcher",
            "itemid = invenio_app_ils.pidstore.fetchers:item_pid_fetcher",
            "locid = invenio_app_ils.pidstore.fetchers:location_pid_fetcher",
            "ilocid = "
            "invenio_app_ils.pidstore.fetchers:internal_location_pid_fetcher",
            "keyid = invenio_app_ils.pidstore.fetchers:keyword_pid_fetcher",
        ],
        "invenio_pidstore.minters": [
            "docid = invenio_app_ils.pidstore.minters:document_pid_minter",
            "itemid = invenio_app_ils.pidstore.minters:item_pid_minter",
            "locid = invenio_app_ils.pidstore.minters:location_pid_minter",
            "ilocid = "
            "invenio_app_ils.pidstore.minters:internal_location_pid_minter",
            "keyid = invenio_app_ils.pidstore.minters:keyword_pid_minter",
        ],
        "invenio_access.actions": [
            "backoffice_access_action = "
            "invenio_app_ils.permissions:backoffice_access_action"
        ],
        "invenio_records.jsonresolver": [
            "document = invenio_app_ils.records.jsonresolver.document",
            "item_document = "
            "invenio_app_ils.records.jsonresolver.item_document",
            "item_internal_location = "
            "invenio_app_ils.records.jsonresolver.item_internal_location",
            "item_loan = "
            "invenio_app_ils.records.jsonresolver.item_loan",
            "internal_location = "
            "invenio_app_ils.records.jsonresolver.internal_location",
            "keyword = invenio_app_ils.records.jsonresolver.keyword",
        ],
        'invenio_celery.tasks': [
            'indexer = invenio_app_ils.indexer'
        ]
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Development Status :: 3 - Alpha",
    ],
)

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio app ils"""

import os

from setuptools import find_packages, setup

readme = open("README.rst").read()

tests_require = [
    "check-manifest>=0.35",
    "coverage>=4.4.1",
    "isort>=4.3",
    "mock>=2.0.0",
    "pydocstyle>=2.0.0",
    "pytest-cov>=2.5.1",
    "pytest-invenio>=1.0.2,<1.1.0",
    "pytest-mock>=1.6.0",
    "pytest-pep8>=1.0.6",
    "pytest-random-order>=0.5.4",
    "pytest>=3.3.1",
    "selenium>=3.4.3",
]

extras_require = {"docs": ["Sphinx>=1.5.1"], "tests": tests_require}

extras_require["all"] = []
for reqs in extras_require.values():
    extras_require["all"].extend(reqs)

setup_requires = ["Babel>=2.4.0", "pytest-runner>=3.0.0,<5"]

install_requires = [
    "Flask-BabelEx>=0.9.3",
    "Flask-Debugtoolbar>=0.10.1",
    "invenio[postgresql,elasticsearch6,base,auth,metadata]~=3.0.0",
    "invenio-app>=1.0.1",
    "invenio-config>=1.0.1",
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
            "invenio_app_ils_ui = invenio_app_ils.views:blueprint"
        ],
        "invenio_base.api_blueprints": [
            "invenio_app_ils_rest = invenio_app_ils.views:api_blueprint"
        ],
        "invenio_base.api_blueprints": [
            "ils_requests = invenio_app_ils.views:blueprint"
        ],
        "invenio_config.module": [
            "00_invenio_app_ils = invenio_app_ils.config"
        ],
        "invenio_assets.bundles": [
            "invenio_app_ils_main_js = invenio_app_ils.bundles:main_js",
            "invenio_app_ils_main_css = invenio_app_ils.bundles:main_css",
            "invenio_app_ils_backoffice_js = invenio_app_ils.bundles:backoffice_js",
            "invenio_app_ils_backoffice_css = invenio_app_ils.bundles:backoffice_css",
        ],
        "invenio_i18n.translations": ["messages = invenio_app_ils"],
        "invenio_jsonschemas.schemas": [
            "ils_schemas = invenio_app_ils.schemas"
        ],
        "invenio_search.mappings": [
            "documents = invenio_app_ils.mappings",
            "items = invenio_app_ils.mappings",
            "locations = invenio_app_ils.mappings",
        ],
        "invenio_pidstore.fetchers": [
            "document_pid_fetcher = "
            "invenio_app_ils.pid.fetchers:document_pid_fetcher",
            "item_pid_fetcher = "
            "invenio_app_ils.pid.fetchers:item_pid_fetcher",
            "location_pid_fetcher = "
            "invenio_app_ils.pid.fetchers:location_pid_fetcher",
        ],
        "invenio_pidstore.minters": [
            "document_pid_minter = "
            "invenio_app_ils.pid.minters:document_pid_minter",
            "item_pid_minter = invenio_app_ils.pid.minters:item_pid_minter",
            "location_pid_minter = "
            "invenio_app_ils.pid.minters:location_pid_minter",
        ],
        "invenio_access.actions": [
            "ils_librarian_access = "
            "invenio_app_ils.permissions:librarian_access"
        ],
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

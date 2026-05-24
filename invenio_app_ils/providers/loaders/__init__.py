# SPDX-FileCopyrightText: 2019-2021 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App Provider loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.provider import ProviderSchemaV1

provider_loader = ils_marshmallow_loader(ProviderSchemaV1)

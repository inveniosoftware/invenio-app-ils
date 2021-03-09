# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App Provider loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.provider import ProviderSchemaV1

provider_loader = ils_marshmallow_loader(ProviderSchemaV1)

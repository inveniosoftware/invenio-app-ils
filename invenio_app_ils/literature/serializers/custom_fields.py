# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Literature custom serializer functions."""

from flask import current_app


def field_cover_metadata(metadata):
    """Build urls for literature covers."""
    url_builder = current_app.config.get("ILS_LITERATURE_COVER_URLS_BUILDER")
    cover_metadata = metadata.get("cover_metadata", {})
    cover_metadata["urls"] = url_builder(metadata)
    metadata["cover_metadata"] = cover_metadata

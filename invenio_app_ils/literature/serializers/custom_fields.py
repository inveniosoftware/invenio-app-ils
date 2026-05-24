# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Literature custom serializer functions."""

from flask import current_app


def field_cover_metadata(metadata):
    """Build urls for literature covers."""
    url_builder = current_app.config.get("ILS_LITERATURE_COVER_URLS_BUILDER")
    cover_metadata = metadata.get("cover_metadata", {})
    cover_metadata["urls"] = url_builder(metadata)
    metadata["cover_metadata"] = cover_metadata

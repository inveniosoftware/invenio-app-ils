# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Preserve cover metadata."""


def preserve_cover_metadata(data, prev_record=None):
    """Preserve cover metadata if they existed."""
    if "cover_metadata" not in data and prev_record:
        data["cover_metadata"] = prev_record.get("cover_metadata", {})

    return data

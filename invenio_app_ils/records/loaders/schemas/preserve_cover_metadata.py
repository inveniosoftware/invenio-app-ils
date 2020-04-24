# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Preserve cover metadata."""

from flask import has_request_context


def preserve_cover_metadata(data, prev_record):
    """Preserver cover metadata if they exist."""
    if not has_request_context() or prev_record is None:
        return data

    data["cover_metadata"] = prev_record.get("cover_metadata", {})
    return data

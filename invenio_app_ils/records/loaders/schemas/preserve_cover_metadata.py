# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Preserve cover metadata."""


def preserve_cover_metadata(data, prev_record=None):
    """Preserve cover metadata if they existed."""
    if "cover_metadata" not in data and prev_record:
        data["cover_metadata"] = prev_record.get("cover_metadata", {})

    return data

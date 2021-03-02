# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document utils."""

MAX_AUTHORS = 5


def flatten_authors(authors):
    """Flatten document authors array to a string."""
    result = "; ".join([a["full_name"] for a in authors[:MAX_AUTHORS]])

    if len(authors) > MAX_AUTHORS:
        result += " et al."

    return result

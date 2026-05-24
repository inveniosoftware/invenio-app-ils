# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Document utils."""

MAX_AUTHORS = 5


def flatten_authors(authors):
    """Flatten document authors array to a string."""
    result = "; ".join([a["full_name"] for a in authors[:MAX_AUTHORS]])

    if len(authors) > MAX_AUTHORS:
        result += " et al."

    return result

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document configuration callbacks."""


def build_ils_demo_cover_urls(metadata):
    """Build working ulrs for demo data."""
    default_url = "http://covers.openlibrary.org/b/isbn"
    cover_meta = metadata.get("cover_metadata", {})
    isbn = cover_meta.get("ISBN", "")
    return {
        "small": "{url}/{isbn}-S.jpg".format(url=default_url, isbn=isbn),
        "medium": "{url}/{isbn}-M.jpg".format(url=default_url, isbn=isbn),
        "large": "{url}/{isbn}-L.jpg".format(url=default_url, isbn=isbn),
    }

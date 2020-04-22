# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document configuration callbacks."""


def build_default_cover_urls(metadata):
    """Build default ulrs for literature, documents & series."""
    default_url = "/images/placeholder-portrait.png"
    return {
        "small": "{0}".format(default_url),
        "medium": "{0}".format(default_url),
        "large": "{0}".format(default_url),
    }


def build_ils_demo_cover_urls(metadata):
    """Build working ulrs for demo data."""
    default_url = "http://covers.openlibrary.org/b/isbn"
    cover_meta = metadata.get("cover_metadata", {})
    isbn = cover_meta.get("isbn", "")
    return {
        "small": "{url}/{isbn}-S.jpg".format(url=default_url, isbn=isbn),
        "medium": "{url}/{isbn}-M.jpg".format(url=default_url, isbn=isbn),
        "large": "{url}/{isbn}-L.jpg".format(url=default_url, isbn=isbn),
    }

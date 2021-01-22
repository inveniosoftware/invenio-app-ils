# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document configuration callbacks."""

from flask import url_for


def build_ils_demo_cover_urls(metadata):
    """Build working ulrs for demo data."""
    cover_metadata = metadata.get("cover_metadata", {})
    isbn = cover_metadata.get("ISBN", "")
    if isbn:
        return build_openlibrary_urls(isbn)
    return build_placeholder_urls()


def build_openlibrary_urls(isbn):
    """Build Open Library urls."""
    url = "https://covers.openlibrary.org/b/isbn"
    return {
        "is_placeholder": False,
        "small": "{url}/{isbn}-S.jpg".format(url=url, isbn=isbn),
        "medium": "{url}/{isbn}-M.jpg".format(url=url, isbn=isbn),
        "large": "{url}/{isbn}-L.jpg".format(url=url, isbn=isbn),
    }


def build_placeholder_urls():
    """Build urls for default cover placeholders."""
    image_path = url_for(
        "invenio_app_ils.static",
        filename="images/placeholder.png",
        _external=True,
    )
    return {
        "is_placeholder": True,
        "small": image_path,
        "medium": image_path,
        "large": image_path,
    }

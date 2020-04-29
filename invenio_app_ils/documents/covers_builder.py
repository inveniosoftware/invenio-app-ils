# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document configuration callbacks."""


def build_ils_demo_cover_urls(metadata):
    """Build working ulrs for demo data."""

    cover_metadata = metadata.get("cover_metadata", {})
    isbn = cover_metadata.get("ISBN")

    if isbn:
        return build_openlibrary_urls(isbn)
    return build_placeholder_urls(metadata)


def build_openlibrary_urls(isbn):
    url = "http://covers.openlibrary.org/b/isbn"
    return {
        "small": "{url}/{isbn}-S.jpg".format(url=url, isbn=isbn),
        "medium": "{url}/{isbn}-M.jpg".format(url=url, isbn=isbn),
        "large": "{url}/{isbn}-L.jpg".format(url=url, isbn=isbn),
    }


def build_placeholder_urls(metadata):
    url = "https://via.placeholder.com"
    sizes = {"small": 94, "medium": 180, "large": 400}
    schema = metadata.get("$schema", "")
    params = {}

    if schema.endswith("document-v1.0.0.json"):
        params = {
            "bg_color": "078080",
            "text_color": "f8f5f2",
            "text": "Document"
        }

    if schema.endswith("series-v1.0.0.json"):
        params = {
            "bg_color": "f45d48",
            "text_color": "232323",
            "text": "Series"
        }

    result = {}
    if params:
        for key, value in sizes.items():
            result[key] = (
                "{url}/{size}/{bg_color}/{text_color}?text={text}"
            ).format(url=url, size=value, **params)
    return result

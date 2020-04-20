# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document configuration callbacks."""


def build_default_cover_urls(record):
    """Build default ulrs for literature, documents & series without cover."""
    default_url = "/images/placeholder-portrait.png"
    return {
        "small": "{0}".format(default_url),
        "medium": "{0}".format(default_url),
        "large": "{0}".format(default_url),
    }


# NOTE: move it to cds-books, we can use it if we want covers for dev.
def build_literature_cover_urls(record):
    """Decorate literature with cover urls for all sizes."""

    def build_urls(url, params):
        """Build all available size urls."""
        return {
            "small": "{0}/{1}".format(url, params["small"]),
            "medium": "{0}/{1}".format(url, params["medium"]),
            "large": "{0}/{1}".format(url, params["large"]),
        }

    syndetic_client = "cernlibrary"
    syndetic_domain = "https://secure.syndetics.com/index.aspx"
    syndentic_sizes = {
        "small": "SC.gif",
        "medium": "MC.gif",
        "large": "MC.gif",
    }

    result = build_default_cover_urls(record)

    if (
        "items" in record and
        "hits" in record["items"] and
        len(record["items"]["hits"])
    ):
        cover_item = record["items"]["hits"][0]
        if "isbn" in cover_item:
            url = "{0}?client={1}&isbn={2}".format(
                syndetic_domain, syndetic_client, cover_item["isbn"]["value"])
            result = build_urls(url, syndentic_sizes)

    if "identifiers" in record:
        for identifier in record["identifiers"]:
            if identifier["scheme"] == "ISSN":
                url = "{0}?client={1}&issn={2}".format(
                    syndetic_domain, syndetic_client, identifier["value"])
                result = build_urls(url, syndentic_sizes)
                break

            if identifier["scheme"] == "ISBN":
                url = "{0}?client={1}&isbn={2}".format(
                    syndetic_domain, syndetic_client, identifier["value"])
                result = build_urls(url, syndentic_sizes)
    return result

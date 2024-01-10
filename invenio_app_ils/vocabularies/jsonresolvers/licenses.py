# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the referenced license."""

from urllib.parse import unquote_plus

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.vocabularies.api import VOCABULARY_TYPE_LICENSE

# Note: there must be only one resolver per file,
# otherwise only the last one is registered

REF_LICENSE_URL_ABSOLUTE_PATH = "{scheme}://{host}/api/resolver/licenses/{license_id}"
REF_LICENSE_URL_RELATIVE_PATH = "/api/resolver/licenses/<license_id>"


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred license for a record."""
    from flask import current_app

    def license_resolver(license_id):
        """Search and return the license info."""
        _id = unquote_plus(license_id)
        vocabulary_search = current_app_ils.vocabulary_search_cls()

        search = vocabulary_search.search_by_type_and_key(
            type=VOCABULARY_TYPE_LICENSE, key=unquote_plus(_id)
        )
        search_result = search.execute()
        total = search_result.hits.total.value

        _license = dict()
        if total == 1:
            hit = search_result.hits[0].to_dict()
            _license = dict(
                id=_id,
                maintainer=hit["data"].get("maintainer", ""),
                status=hit["data"].get("status", ""),
                title=hit["text"],
                url=hit["data"].get("url", ""),
            )
        else:
            _license = dict(
                id=_id,
                maintainer="",
                status="",
                title="",
                url="",
            )

        return _license

    url_map.add(
        Rule(
            REF_LICENSE_URL_RELATIVE_PATH,
            endpoint=license_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )

# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the files for the EItem."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.eitems.api import EItem

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Document for an EItem record."""
    from flask import current_app

    def files_resolver(eitem_pid):
        """Return the Document record for the given EItem or raise."""
        files = []
        for obj in EItem.get_record_by_pid(eitem_pid).files:
            files.append(
                {
                    "bucket": obj.bucket_id,
                    "checksum": obj.file.checksum,
                    "file_id": obj.file.id,
                    "key": obj.key,
                    "size": obj.file.size,
                    "version_id": str(obj.version_id),
                }
            )
        return files

    url_map.add(
        Rule(
            "/api/resolver/eitems/<eitem_pid>/files",
            endpoint=files_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )

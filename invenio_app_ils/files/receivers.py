# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS files receivers."""

from invenio_files_rest.signals import file_deleted, file_uploaded

from invenio_app_ils.eitems.indexer import index_eitem_after_files_changed


def on_file_changed(obj):
    """Index eitems after files changed."""
    index_eitem_after_files_changed.apply_async([str(obj.bucket_id)])


def register_files_signals():
    """Register files signal."""
    file_deleted.connect(on_file_changed, weak=False)
    file_uploaded.connect(on_file_changed, weak=False)

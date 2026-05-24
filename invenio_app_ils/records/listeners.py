# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Item receivers."""
from datetime import datetime

from flask import current_app

from invenio_app_ils.documents.indexer import index_document
from invenio_app_ils.proxies import current_app_ils


def record_delete_listener(sender, *args, **kwargs):
    """Listens for record deletes to reindex parent document."""
    item_class = current_app_ils.item_record_cls
    eitem_class = current_app_ils.eitem_record_cls
    eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]

    record = kwargs["record"]
    schema = record["$schema"]
    is_item = schema.endswith(item_class._schema)
    is_eitem = schema.endswith(eitem_class._schema)

    if is_item or is_eitem:
        document_pid = record["document_pid"]
        index_document.apply_async((document_pid,), eta=eta)

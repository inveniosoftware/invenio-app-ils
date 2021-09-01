# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Notifications APIs."""

import json

from celery import shared_task
from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.proxies import current_app_ils

from .tasks import log_error_notification, log_successful_notification


def build_common_msg_ctx(record):
    """Get common context for notification's message."""
    assert "patron_pid" in record

    Patron = current_app_ils.patron_cls
    patron = Patron.get_patron(record["patron_pid"])
    msg_ctx = dict(patron=patron)

    if "document_pid" in record:
        Document = current_app_ils.document_record_cls
        document = Document.get_record_by_pid(record["document_pid"])

        author = document["authors"][0]["full_name"]
        if len(document["authors"]) > 1:
            author += " et al."

        edition = document.get("edition", "")
        year = document.get("publication_year", "")
        if edition and year:
            edition_year = " ({0} - {1})".format(edition, year)
        elif edition:
            edition_year = " ({0})".format(edition)
        else:
            edition_year = " ({0})".format(year)

        full_title = "{title}, {author}{edition_year}".format(
            title=document["title"], author=author, edition_year=edition_year
        )

        msg_ctx["document"] = dict(
            pid=document["pid"],
            title=document["title"],
            author=author,
            edition=edition,
            publication_year=year,
            full_title=full_title,
        )

    return msg_ctx


def send_notification(patrons, msg, **kwargs):
    """Send a notification using the configured backend(s)."""
    func_or_path = current_app.config["ILS_NOTIFICATIONS_BACKENDS_BUILDER"]
    builder = obj_or_import_string(func_or_path)
    backends = builder(**kwargs)

    if not backends:
        return

    # create a serializable version of the msg for Celery tasks
    serializable_msg = msg.to_dict()
    serializable_msg.update(
        dict(
            is_manually_triggered=kwargs.get("is_manually_triggered", False),
            patron_id=patrons[0].id,
        )
    )

    # log before sending
    log_msg = dict(
        name="notification",
        action="before_send",
        message_id=serializable_msg["id"],
        data=serializable_msg,
    )
    current_app.logger.info(json.dumps(log_msg, sort_keys=True))

    for send in backends:
        # apply @shared_task decorator to the `send` function
        send = shared_task(send)
        # send notification in a Celery task
        send.apply_async(
            args=[patrons, serializable_msg],
            kwargs=kwargs,
            link=log_successful_notification.s(serializable_msg),
            link_error=log_error_notification.s(data=serializable_msg),
        )

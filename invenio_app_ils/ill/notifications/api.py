# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests notifications APIs."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.ill.errors import ILLError
from invenio_app_ils.notifications.api import (
    build_common_msg_ctx,
    send_notification,
)


def _build_ill_msg_ctx(brw_req):
    """Return a dict with extra ILL ctx to pass to jinja templates."""
    try:
        # fetch the patron loan if it exists
        loan = brw_req.patron_loan.get()
    except ILLError:
        # no loan in the borrowing request
        loan = dict()

    return dict(patron_loan=loan)


def send_ill_notification(brw_req, action, msg_extra_ctx=None, **kwargs):
    """Send notification to patron about a document request action."""
    _filter = current_app.config["ILS_ILL_NOTIFICATIONS_FILTER"]
    if _filter and _filter(brw_req, action, **kwargs) is False:
        return

    msg_ctx = msg_extra_ctx or {}
    msg_ctx.update(build_common_msg_ctx(brw_req))
    msg_ctx.update(_build_ill_msg_ctx(brw_req))

    func_or_path = current_app.config["ILS_ILL_NOTIFICATIONS_MSG_BUILDER"]
    builder = obj_or_import_string(func_or_path)
    msg = builder(record=brw_req, action=action, msg_ctx=msg_ctx, **kwargs)

    patron = msg_ctx["patron"]
    patrons = [patron]

    send_notification(patrons, msg, **kwargs)


def ill_notifications_filter(record, action, **kwargs):
    """Filter ILL notifications to be sent."""
    return True

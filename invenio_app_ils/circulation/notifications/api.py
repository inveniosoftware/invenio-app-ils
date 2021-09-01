# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation notifications APIs."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.notifications.api import (
    build_common_msg_ctx,
    send_notification,
)


def _build_circulation_msg_ctx():
    """Return a dict with extra circulation ctx to pass to jinja templates."""
    return dict(
        circulation_delivery_methods=current_app.config[
            "ILS_CIRCULATION_DELIVERY_METHODS"
        ]
    )


def send_loan_notification(loan, action, msg_extra_ctx=None, **kwargs):
    """Send notification to patron about a loan action."""
    _filter = current_app.config["ILS_NOTIFICATIONS_FILTER_CIRCULATION"]
    if _filter and _filter(loan, action, **kwargs) is False:
        return

    msg_ctx = msg_extra_ctx or {}
    msg_ctx.update(build_common_msg_ctx(loan))
    msg_ctx.update(_build_circulation_msg_ctx())

    func_or_path = current_app.config[
        "ILS_NOTIFICATIONS_MSG_BUILDER_CIRCULATION"
    ]
    builder = obj_or_import_string(func_or_path)
    MsgBuilder = builder(**kwargs)
    msg = MsgBuilder.build(loan, action, msg_ctx, **kwargs)

    patron = msg_ctx["patron"]
    patrons = [patron]

    send_notification(patrons, msg, **kwargs)

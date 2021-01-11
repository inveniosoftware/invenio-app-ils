# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL mail tasks."""

from invenio_app_ils.ill.errors import ILLError
from invenio_app_ils.ill.mail.factory import ill_message_creator_factory
from invenio_app_ils.mail.messages import get_common_message_ctx
from invenio_app_ils.mail.tasks import send_ils_email


def send_ill_mail(brw_req, action=None, message_ctx={}, **kwargs):
    """Send an ILL email.

    :param brw_req: the borrowing request record.
    :param action: the action performed, if any.
    :param message_ctx: any other parameter to be passed as ctx in the msg.
    """
    creator = ill_message_creator_factory()

    message_ctx.update(get_common_message_ctx(record=brw_req))
    try:
        # fetch and inject in the email template the patron loan if available
        loan = brw_req.patron_loan.get()
        message_ctx["patron_loan"] = loan
    except ILLError:
        # no loan in the borrowin request
        message_ctx["patron_loan"] = dict()

    patron = message_ctx["patron"]

    msg = creator(
        brw_req,
        action=action,
        message_ctx=message_ctx,
        recipients=[patron.email],
        **kwargs,
    )
    send_ils_email(msg)

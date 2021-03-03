# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Admin panel for sent emails."""

from flask import Blueprint
from flask_admin.contrib.sqla import ModelView
from flask_babelex import gettext as _

from invenio_app_ils.mail.models import EmailLog


class EmailLogModelView(ModelView):
    """Invenio admin view for sent emails."""

    column_list = (
        "id",
        "is_manually_triggered",
        "recipient_user_id",
        "triggered_on",
        "send_log",
        "message_id",
        "email_action",
        "pid_type",
        "pid_value",
    )

    # Entries are read-only
    can_create = False
    can_edit = False
    can_delete = False

    can_view_details = True

    form_excluded_columns = EmailLog.__table__.columns
    column_default_sort = (EmailLog.triggered_on, True)

    column_filters = column_list


blueprint = Blueprint(
    "ils_admin",
    __name__,
    template_folder="templates",
    static_folder="static",
)

email_log = {
    "model": EmailLog,
    "modelview": EmailLogModelView,
    "name": "Email Log",
    "category": _("User Management"),
}

__all__ = ("email_log",)

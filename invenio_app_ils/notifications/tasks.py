# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Notifications tasks."""

import json

from celery import shared_task
from flask import current_app

from invenio_app_ils.notifications.models import NotificationsLogs


def _log_notification_to_db(data, log_message):
    """Log notification in DB."""
    data_dict = dict(
        action=data.get("action", None),
        pid_type=data.get("pid_type", None),
        pid_value=data.get("pid_value", None),
        recipient_user_id=data["patron_id"],
        is_manually_triggered=data["is_manually_triggered"],
        message_id=data["id"],
        send_log=log_message,
    )
    NotificationsLogs.create(data_dict)


@shared_task
def log_successful_notification(_, data):
    """Log successful notification task."""
    log_msg = dict(
        name="notification",
        action="success",
        message_id=data["id"],
        data=data,
    )
    current_app.logger.info(json.dumps(log_msg, sort_keys=True))
    _log_notification_to_db(data, "Success")


@shared_task
def log_error_notification(request, exc, traceback, data, **kwargs):
    """Log error when sending notification task."""
    error = dict(
        name="notification",
        action="error",
        message_id=data["id"],
        task_id=request.get("id"),
        task=request.get("task"),
        exception=repr(exc),
        data=data,
    )
    current_app.logger.exception(json.dumps(error, sort_keys=True), exc_info=exc)
    _log_notification_to_db(data, "Error: " + repr(exc))

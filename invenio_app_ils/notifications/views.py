# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Notifications views."""

from flask import Blueprint, abort
from sqlalchemy.orm.exc import NoResultFound
from webargs import fields, validate
from webargs.flaskparser import use_kwargs

from invenio_app_ils.notifications.models import NotificationsLogs
from invenio_app_ils.permissions import need_permissions


def serialize_notification(notification):
    """Serialize notification from db."""
    if notification is None:
        return {}
    notification.triggered_on = notification.triggered_on.isoformat()
    notification = notification.__dict__
    del notification["_sa_instance_state"]
    return notification


def get_notifications_blueprint(_):
    """Create the notifications blueprint."""
    blueprint = Blueprint("invenio_app_ils_notifications", __name__)

    @blueprint.route("/notifications")
    @use_kwargs(
        {
            "recipient_user_id": fields.Int(),
            "pid_type": fields.Str(),
            "pid_value": fields.Str(),
            "action": fields.Str(),
            "size": fields.Int(validate=[validate.Range(min=1, max=100)]),
        }
    )
    @need_permissions("send-notification-to-patron")
    def get_notifications(
        recipient_user_id=None,
        pid_type=None,
        pid_value=None,
        action=None,
        size=20,
    ):
        filters = {}
        if recipient_user_id:
            filters.update({"recipient_user_id": recipient_user_id})
        if pid_type:
            filters.update({"pid_type": pid_type})
        if pid_value:
            filters.update({"pid_value": pid_value})
        if action:
            filters.update({"action": action})

        notifications = (
            NotificationsLogs.query.filter_by(**filters)
            .order_by(NotificationsLogs.triggered_on.desc())
            .limit(size)
            .all()
        )

        for i, notification in enumerate(notifications):
            notifications[i] = serialize_notification(notification)

        return {"hits": notifications, "total": len(notifications)}

    @blueprint.route("/notifications/<int:id>")
    @need_permissions("send-notification-to-patron")
    def get_notification(id):
        try:
            notification = NotificationsLogs.query.filter_by(id=id).one()
            return serialize_notification(notification)
        except NoResultFound:
            abort(404)

    return blueprint

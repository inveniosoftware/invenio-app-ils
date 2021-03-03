# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS email views."""

from flask import Blueprint, abort
from sqlalchemy.orm.exc import NoResultFound
from webargs import fields, validate
from webargs.flaskparser import use_kwargs

from invenio_app_ils.mail.models import EmailLog
from invenio_app_ils.permissions import need_permissions


def serialize_email(email):
    """Serialize email from db."""
    if email is None:
        return {}
    email.triggered_on = email.triggered_on.isoformat()
    email = email.__dict__
    del email["_sa_instance_state"]
    return email


def get_emails_list_blueprint(_):
    """Add email list view to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_emails_list", __name__)

    @blueprint.route("/emails")
    @use_kwargs(
        {
            "recipient_user_id": fields.Int(),
            "pid_type": fields.Str(),
            "pid_value": fields.Str(),
            "email_action": fields.Str(),
            "size": fields.Int(validate=[validate.Range(min=1, max=100)]),
        }
    )
    @need_permissions("send-email-to-patron")
    def get_emails(
        recipient_user_id=None,
        pid_type=None,
        pid_value=None,
        email_action=None,
        size=20,
    ):
        filters = {}
        if recipient_user_id:
            filters.update({"recipient_user_id": recipient_user_id})
        if pid_type:
            filters.update({"pid_type": pid_type})
        if pid_value:
            filters.update({"pid_value": pid_value})
        if email_action:
            filters.update({"email_action": email_action})

        emails = (
            EmailLog.query.filter_by(**filters)
            .order_by(EmailLog.triggered_on.desc())
            .limit(size)
            .all()
        )

        for i, email in enumerate(emails):
            emails[i] = serialize_email(email)

        return {"hits": emails, "total": len(emails)}

    return blueprint


def get_emails_item_blueprint(_):
    """Add emails item view to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_emails_item", __name__)

    @blueprint.route("/emails/<int:id>")
    @need_permissions("send-email-to-patron")
    def get_email(id):
        try:
            email = EmailLog.query.filter_by(id=id).one()
        except NoResultFound:
            abort(404)

        email = serialize_email(email)

        return email

    return blueprint

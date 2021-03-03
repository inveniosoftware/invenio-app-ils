# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Database model for emails."""

from datetime import datetime

from celery.utils.log import get_task_logger
from invenio_db import db

celery_logger = get_task_logger(__name__)


class EmailLog(db.Model):
    """Store the sent emails history."""

    __tablename__ = "sent_emails"

    id = db.Column(db.Integer, primary_key=True)

    is_manually_triggered = db.Column(db.Boolean, nullable=False)
    """If it was triggered manually or automatically."""

    recipient_user_id = db.Column(db.Integer, nullable=False)
    """The recipient user id."""

    triggered_on = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now()
    )
    """Datetime the email was sent."""

    send_log = db.Column(db.String, nullable=False)
    """Info from log_successful_mail/log_error_mail celery callbacks."""

    message_id = db.Column(db.String, nullable=False)
    """The UUID of them email message."""

    email_action = db.Column(db.String)
    """Action that triggered the email, e.g. checkout (optional)."""

    pid_type = db.Column(db.String)
    """The pid type of the related record (optional)."""

    pid_value = db.Column(db.String)
    """The pid value of the related record (optional)."""

    @classmethod
    def create(cls, data):
        """Create a new log entry."""
        log = cls(**data)
        db.session.add(log)
        db.session.commit()
        return log

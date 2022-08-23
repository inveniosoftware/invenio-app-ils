# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS views."""

from flask import Blueprint, g, jsonify, render_template
from invenio_accounts.views.rest import UserInfoView, default_user_payload
from invenio_userprofiles import UserProfile


class UserInfoResource(UserInfoView):
    """Retrieve current user's information."""

    def get_user_roles(self):
        """Get all user roles."""
        return [need.value for need in g.identity.provides if need.method == "role"]

    def success_response(self, user):
        """Return response with current user's information."""
        from invenio_app_ils.proxies import current_app_ils

        user_payload = default_user_payload(user)
        user_payload["roles"] = self.get_user_roles()
        # fetch user profile for extra info
        user_profile = UserProfile.get_by_userid(user.id)

        loc_pid_value, _ = current_app_ils.get_default_location_pid
        user_payload.update(
            dict(
                username=user_profile.username,
                full_name=user_profile.full_name,
                location_pid=loc_pid_value,
            )
        )
        return jsonify(user_payload), 200


def create_logged_out_blueprint(app):
    """Create logged_out blueprint."""
    blueprint = Blueprint("logged_out", __name__)
    if app.config["DEBUG"]:
        blueprint.add_url_rule(
            "/logged-out",
            view_func=logged_out_view,
        )
    return blueprint


def logged_out_view():
    """Render logged_out view."""
    return render_template("logged_out.html")

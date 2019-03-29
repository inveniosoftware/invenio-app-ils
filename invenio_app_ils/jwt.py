# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""ILS jwt creation factory."""

from __future__ import absolute_import, print_function

from flask_security import current_user
from invenio_accounts.utils import jwt_create_token
from invenio_userprofiles.api import current_userprofile


def ils_jwt_create_token():
    """JWT creation factory."""
    user_id = current_user.get_id()
    additional_data = {"locationPid": "1"}
    if user_id:
        roles = [role.name for role in current_user.roles]
        username = current_userprofile.username or current_user.email
        additional_data.update({"roles": roles, "username": username})
    return jwt_create_token(user_id=user_id, additional_data=additional_data)

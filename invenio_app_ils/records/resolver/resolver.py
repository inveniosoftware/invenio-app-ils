# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolvers common."""

from invenio_app_ils.errors import PatronNotFoundError
from invenio_app_ils.proxies import current_app_ils


def get_patron(patron_pid):
    """Resolve a Patron for a given field."""
    if not patron_pid:
        return {}
    try:
        return current_app_ils.patron_cls.get_patron(
            patron_pid
        ).dumps_loader()
    except PatronNotFoundError:
        return {}

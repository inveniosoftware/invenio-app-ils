# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS mail utils."""

from jinja2 import Markup


def prepare_ctx_to_be_inserted_in_html(message_ctx):
    """Prepares the strings to be displayed in HTML and XML documents."""
    for elem in message_ctx:
        if isinstance(message_ctx[elem], str):
            message_ctx[elem] = Markup(message_ctx[elem])
        elif isinstance(message_ctx[elem], list):
            for index, item in enumerate(message_ctx[elem], start=0):
                if isinstance(message_ctx[elem][index], str):
                    message_ctx[elem][index] = Markup(message_ctx[elem][index])
        elif isinstance(message_ctx[elem], dict):
            prepare_ctx_to_be_inserted_in_html(message_ctx[elem])

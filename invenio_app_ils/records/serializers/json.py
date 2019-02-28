# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Marshmallow based JSON serializer for records."""

from __future__ import absolute_import, print_function

from flask import json, request
from invenio_records_rest.serializers.base import PreprocessorMixin, \
    SerializerMixinInterface
from invenio_records_rest.serializers.marshmallow import MarshmallowMixin


class JSONSerializerMixin(SerializerMixinInterface):
    """Mixin serializing records as JSON."""

    @staticmethod
    def _format_args():
        """Get JSON dump indentation and separates."""
        if request and request.args.get('prettyprint'):
            return dict(
                indent=2,
                separators=(', ', ': '),
            )
        else:
            return dict(
                indent=None,
                separators=(',', ':'),
            )

    def serialize(self, loans, errors, record_serializer=None,
                  links_factory=None,
                  **kwargs):
        """Serialize a single record and persistent identifier.

        :param loans: list of loans
        :param errors: list of errors.
        :param links_factory: Factory function for record links.
        """
        return json.dumps(
            dict(
                loans=[record_serializer.transform_record(
                    loan['loan_pid'], loan, links_factory,
                    **kwargs) for loan in loans],
                errors=[error for error in errors]
            ),
            **self._format_args())


class MultipleCheckoutJSONSerializer(JSONSerializerMixin,
                                     MarshmallowMixin, PreprocessorMixin):
    """Marshmallow based JSON serializer for records."""

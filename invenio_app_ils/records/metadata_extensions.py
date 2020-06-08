# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Metadata Extensions."""

from copy import deepcopy

from flask import current_app
from invenio_records_rest.schemas.fields import DateString, SanitizedUnicode
from marshmallow import Schema
from marshmallow.fields import Bool, Integer, List


class MetadataExtensions(object):
    """Custom metadata extensions helper class."""

    def __init__(self, namespaces, extensions):
        """Constructor."""
        self.namespaces = deepcopy(namespaces) or {}
        self.extensions = deepcopy(extensions) or {}
        self._validate()

    def _validate_marshmallow_type(self, field_cfg):
        """Make sure the Marshmallow type is one we support."""
        def validate_basic_marshmallow_type(_type):
            allowed_types = [
                Bool, DateString, Integer, SanitizedUnicode
            ]
            assert any([
                isinstance(_type, allowed_type) for allowed_type
                in allowed_types
            ])

        marshmallow_type = field_cfg["marshmallow"]
        if isinstance(marshmallow_type, List):
            validate_basic_marshmallow_type(marshmallow_type.inner)
        else:
            validate_basic_marshmallow_type(marshmallow_type)

    def _validate_elasticsearch_type(self, field_cfg):
        """Make sure the Elasticsearch type is one we support."""
        allowed_types = [
            "boolean", "date", "long", "keyword", "text"
        ]
        assert field_cfg["elasticsearch"] in allowed_types

    def _validate(self):
        """Validates extension configuration.

        We only allow certain types, so this private method flags divergence
        from what is allowed early.
        """
        # Validate namespaces
        contexts = set()
        for settings in self.namespaces.values():
            assert settings["@context"] not in contexts
            contexts.add(settings["@context"])

        # Validate extensions
        prefixes = self.namespaces.keys()
        for field_key, field_cfg in self.extensions.items():
            prefix = field_key.split(":", 1)[0]
            assert prefix in prefixes
            self._validate_marshmallow_type(field_cfg)
            self._validate_elasticsearch_type(field_cfg)

    def to_schema(self):
        """Dynamically creates and returns the extensions Schema."""
        schema_dict = {
            field_key: field_cfg["marshmallow"]
            for field_key, field_cfg in self.extensions.items()
        }
        return Schema.from_dict(schema_dict)

    def get_field_type(self, field_key, _type):
        """Returns type value for given field_key and _type.

        :params field_key: str formatted as <prefix>:<field_id>
        :params _type: str "elasticsearch" or "marshmallow"
        """
        return (
            self.extensions
                .get(field_key, {})
                .get(_type)
        )


def add_es_metadata_extensions(record_dict):
    """Add "extensions_X" fields to record_dict prior to Elasticsearch index.

    :param record_dict: dumped Record dict
    """
    rec_type = record_dict["$schema"].split("/")[-1].split("-")[0]
    metadata_extensions = getattr(
        current_app.extensions["invenio-app-ils"],
        "{}_metadata_extensions".format(rec_type)
    )

    for key, value in record_dict.get("extensions", {}).items():
        field_type = metadata_extensions.get_field_type(key, "elasticsearch")
        if not field_type:
            continue

        es_field = "extensions_{}s".format(field_type)

        if es_field not in record_dict:
            record_dict[es_field] = []

        record_dict[es_field].append({"key": key, "value": value})

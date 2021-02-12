# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test metadata extensions."""

import pytest
from invenio_indexer.api import RecordIndexer
from invenio_records_rest.schemas.fields import DateString, SanitizedUnicode
from marshmallow import ValidationError
from marshmallow.fields import Bool, Integer, List

from invenio_app_ils.records.metadata_extensions import MetadataExtensions


@pytest.fixture(scope="module")
def app_config(app_config):
    """Override conftest.py's app_config"""
    app_config["ILS_RECORDS_METADATA_NAMESPACES"] = {
        "document": {
            "accelerator_experiments": {
                "@context": "https://example.com/accelerator_experiments/terms"
            },
            "standard_status": {
                "@context": "https://example.com/standard_status/terms"
            },
        }
    }

    app_config["ILS_RECORDS_METADATA_EXTENSIONS"] = {
        "document": {
            "accelerator_experiments_accelerator": {
                "elasticsearch": "keyword",
                "marshmallow": SanitizedUnicode(required=True),
            },
            "accelerator_experiments_project": {
                "elasticsearch": "text",
                "marshmallow": SanitizedUnicode(),
            },
            "accelerator_experiments_number_in_sequence": {
                "elasticsearch": "long",
                "marshmallow": Integer(),
            },
            "accelerator_experiments_scientific_sequence": {
                "elasticsearch": "long",
                "marshmallow": List(Integer()),
            },
            "standard_status_original_presentation_date": {
                "elasticsearch": "date",
                "marshmallow": DateString(),
            },
            "standard_status_right_or_wrong": {
                "elasticsearch": "boolean",
                "marshmallow": Bool(),
            },
        }
    }

    return app_config


def assert_unordered_equality(array_dict1, array_dict2):
    array1 = sorted(array_dict1, key=lambda d: d["key"])
    array2 = sorted(array_dict2, key=lambda d: d["key"])
    assert array1 == array2


def test_metadata_extensions(db, es, testdata):
    """Tests that a Record is indexed into Elasticsearch properly.
    - Tests that the before_record_index_hook is registered properly.
    - Tests add_es_metadata_extensions.
    - Tests jsonschema validates correctly
    - Tests that retrieved record document is fine.
    NOTE:
        - es fixture depends on appctx fixture, so we are in app context
        - this test requires a running ES instance
    """
    document = testdata["documents"][0]
    data = {
        "extensions": {
            "accelerator_experiments_accelerator": "LHCb",
            "accelerator_experiments_project": "A project for experiment.",
            "accelerator_experiments_number_in_sequence": 3,
            "accelerator_experiments_scientific_sequence": [1, 1, 2, 3, 5, 8],
            "standard_status_original_presentation_date": "2019-02-14",
            "standard_status_right_or_wrong": True,
        }
    }
    document.update(data)
    document.validate()
    db.session.commit()
    indexer = RecordIndexer()
    index_result = indexer.index(document)

    _index = index_result["_index"]
    _doc = index_result["_type"]
    _id = index_result["_id"]
    es_doc = es.get(index=_index, doc_type=_doc, id=_id)
    source = es_doc["_source"]
    expected_keywords = [
        {"key": "accelerator_experiments_accelerator", "value": "LHCb"},
    ]
    expected_texts = [
        {
            "key": "accelerator_experiments_project",
            "value": "A project for experiment.",
        },
    ]
    expected_longs = [
        {"key": "accelerator_experiments_number_in_sequence", "value": 3},
        {
            "key": "accelerator_experiments_scientific_sequence",
            "value": [1, 1, 2, 3, 5, 8],
        },
    ]
    expected_dates = [
        {
            "key": "standard_status_original_presentation_date",
            "value": "2019-02-14",
        },
    ]
    expected_booleans = [
        {"key": "standard_status_right_or_wrong", "value": True},
    ]
    assert_unordered_equality(source["extensions_keywords"], expected_keywords)
    assert_unordered_equality(source["extensions_texts"], expected_texts)
    assert_unordered_equality(source["extensions_longs"], expected_longs)
    assert_unordered_equality(source["extensions_dates"], expected_dates)
    assert_unordered_equality(source["extensions_booleans"], expected_booleans)


def test_extensions():
    """Test metadata extensions schema."""
    ILS_RECORDS_METADATA_NAMESPACES = {
        "accelerator_experiments": {
            "@context": "https://example.com/accelerator_experiments/terms"
        },
        "standard_status": {
            "@context": "https://example.com/standard_status/terms"
        },
    }

    ILS_RECORDS_METADATA_EXTENSIONS = {
        "accelerator_experiments_accelerator": {
            "elasticsearch": "keyword",
            "marshmallow": SanitizedUnicode(required=True),
        },
        "accelerator_experiments_project": {
            "elasticsearch": "text",
            "marshmallow": SanitizedUnicode(),
        },
        "accelerator_experiments_number_in_sequence": {
            "elasticsearch": "long",
            "marshmallow": Integer(),
        },
        "accelerator_experiments_scientific_sequence": {
            "elasticsearch": "long",
            "marshmallow": List(Integer()),
        },
        "standard_status_original_presentation_date": {
            "elasticsearch": "date",
            "marshmallow": DateString(),
        },
        "standard_status_right_or_wrong": {
            "elasticsearch": "boolean",
            "marshmallow": Bool(),
        },
    }

    extensions = MetadataExtensions(
        ILS_RECORDS_METADATA_NAMESPACES, ILS_RECORDS_METADATA_EXTENSIONS
    )
    ExtensionsSchema = extensions.to_schema()

    # Minimal if not absent
    valid_minimal = {"accelerator_experiments_accelerator": "LHCb"}

    data = ExtensionsSchema().load(valid_minimal)

    assert data == valid_minimal

    # Full
    valid_full = {
        "accelerator_experiments_accelerator": "LHCb",
        "accelerator_experiments_project": "A project for experiment.",
        "accelerator_experiments_number_in_sequence": 3,
        "accelerator_experiments_scientific_sequence": [1, 1, 2, 3, 5, 8],
        "standard_status_original_presentation_date": "2019-02-14",
        "standard_status_right_or_wrong": True,
    }

    data = ExtensionsSchema().load(valid_full)

    assert data == valid_full

    # Invalid
    invalid_number_in_sequence = {
        "accelerator_experiments_accelerator": "LHCb",
        "accelerator_experiments_scientific_sequence": [1, "l", 2, 3, 5, 8],
    }
    with pytest.raises(ValidationError):
        data = ExtensionsSchema().load(invalid_number_in_sequence)

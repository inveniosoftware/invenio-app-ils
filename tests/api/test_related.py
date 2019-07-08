# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test related records."""

from __future__ import unicode_literals

import pytest

from invenio_app_ils.errors import RelatedRecordError
from invenio_app_ils.records.api import Document, Series
from invenio_app_ils.records.related.api import RelatedRecords, \
    record_to_relation_dump


def test_related_add_editions_to_parent(app, testdata):
    """Test adding related editions."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])
    child2 = Series.get_record_by_pid(testdata["series"][0]["series_pid"])

    doc1.related.add_edition(doc2)
    parent_editions = doc1.related.editions
    child_editions = doc2.related.editions
    assert len(parent_editions) == 1
    assert len(child_editions) == 1
    assert parent_editions[0] == doc2
    assert child_editions[0] == doc1

    doc1.related.add_edition(child2)
    parent_editions = doc1.related.editions
    child_editions = child2.related.editions
    assert len(parent_editions) == 2
    assert len(child_editions) == 2
    assert parent_editions[0] == doc2
    assert parent_editions[1] == child2
    assert child_editions[0] == doc1
    assert child_editions[1] == doc2


def test_related_add_editions_to_child(app, testdata):
    """Test adding related editions to a child."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])
    ser3 = Series.get_record_by_pid(testdata["series"][0]["series_pid"])

    doc1.related.add_edition(doc2)
    doc2.related.add_edition(ser3)

    parent_editions = doc1.related.editions
    child1_editions = doc2.related.editions
    child2_editions = ser3.related.editions

    assert len(parent_editions) == 2
    assert len(child1_editions) == 2
    assert len(child2_editions) == 2

    assert parent_editions[0] == doc2
    assert parent_editions[1] == ser3
    assert child1_editions[0] == doc1
    assert child1_editions[1] == ser3
    assert child2_editions[0] == doc2
    assert child2_editions[1] == doc1


def test_related_add_language(app, testdata):
    """Test adding related languages."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])

    doc1.related.add_language(doc2)

    parent_languages = doc1.related.languages
    child_languages = doc2.related.languages

    assert len(parent_languages) == 1
    assert len(child_languages) == 1
    assert parent_languages[0] == doc2
    assert child_languages[0] == doc1


def test_related_add_same_language(app, testdata):
    """Test adding related languages."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])

    doc1.related.add_language(doc2)
    with pytest.raises(RelatedRecordError):
        doc1.related.add_language(doc2)


def test_related_add_existing_child(related_record, testdata):
    """Add a related language to an existing relation graph."""
    docs = testdata["documents"]
    series = testdata["series"]

    doc1 = Document.get_record_by_pid(docs[0]["document_pid"])
    doc6 = Document.get_record_by_pid(docs[4]["document_pid"])
    ser10 = Series.get_record_by_pid(series[1]["series_pid"])

    # Should fail if trying to add a child that already has relations
    with pytest.raises(RelatedRecordError):
        ser10.related.add_language(doc1)
    with pytest.raises(RelatedRecordError):
        ser10.related.add_language(doc6)


def test_related_remove_language(app, testdata):
    """Test adding related languages."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])

    assert len(doc1.related.languages) == 0

    doc1.related.add_language(doc2)
    assert len(doc1.related.languages) == 1

    doc1.related.remove_language(doc2)
    assert len(doc1.related.languages) == 0


def test_related_add_existing_record(app, related_record, testdata):
    """Test adding an existing related record that was on a different node."""
    # Test language
    docs = testdata["documents"]

    doc6 = Document.get_record_by_pid(docs[4]["document_pid"])
    doc9 = Document.get_record_by_pid(docs[7]["document_pid"])
    assert len(doc6.related.languages) == len(doc9.related.languages) == 2
    with pytest.raises(RelatedRecordError):
        doc6.related.add_language(doc9)
    assert len(doc6.related.languages) == len(doc9.related.languages) == 2

    # Test edition
    doc3 = Document.get_record_by_pid(docs[2]["document_pid"])
    doc4 = Document.get_record_by_pid(docs[3]["document_pid"])
    assert len(doc3.related.editions) == len(doc4.related.editions) == 4
    with pytest.raises(RelatedRecordError):
        doc4.related.add_edition(doc3)
    assert len(doc3.related.editions) == len(doc4.related.editions) == 4


def test_related_add_multiple_children(app, testdata):
    """Test adding an existing related record that was on a different node."""
    # Test language
    docs = testdata["documents"]
    series = testdata["series"]

    doc1 = Document.get_record_by_pid(docs[0]["document_pid"])
    doc2 = Document.get_record_by_pid(docs[1]["document_pid"])
    ser3 = Series.get_record_by_pid(series[0]["series_pid"])

    assert len(doc1.related.editions) == 0
    assert len(doc2.related.editions) == 0
    assert len(ser3.related.editions) == 0

    doc1.related.add_edition(doc2)
    doc1.commit()

    doc1 = Document.get_record_by_pid(docs[0]["document_pid"])
    doc2 = Document.get_record_by_pid(docs[1]["document_pid"])
    ser3 = Series.get_record_by_pid(series[0]["series_pid"])

    assert len(doc1.related.editions) == 1
    assert len(doc2.related.editions) == 1
    assert len(ser3.related.editions) == 0

    doc1.related.add_edition(ser3)
    doc1.commit()

    doc1 = Document.get_record_by_pid(docs[0]["document_pid"])
    doc2 = Document.get_record_by_pid(docs[1]["document_pid"])
    ser3 = Series.get_record_by_pid(series[0]["series_pid"])

    assert len(doc1.related.editions) == 2
    assert len(doc2.related.editions) == 2
    assert len(ser3.related.editions) == 2


def test_related_complex_record(related_record, testdata):
    """Test the related record fixture."""
    docs = testdata["documents"]
    series = testdata["series"]
    doc1 = Document.get_record_by_pid(docs[0]["document_pid"])
    doc2 = Document.get_record_by_pid(docs[1]["document_pid"])
    doc3 = Document.get_record_by_pid(docs[2]["document_pid"])
    doc4 = Document.get_record_by_pid(docs[3]["document_pid"])
    ser5 = Series.get_record_by_pid(series[0]["series_pid"])
    doc6 = Document.get_record_by_pid(docs[4]["document_pid"])
    doc7 = Document.get_record_by_pid(docs[5]["document_pid"])
    doc8 = Document.get_record_by_pid(docs[6]["document_pid"])
    doc9 = Document.get_record_by_pid(docs[7]["document_pid"])

    assert len(doc9.related.editions) == 0

    for rec in (doc1, doc2, doc3, doc4, ser5):
        assert len(rec.related.editions) == 4

    for rec in (doc6, doc7, doc8):
        assert len(rec.related.editions) == 2

    for rec in (doc1, doc6, doc9):
        assert len(rec.related.languages) == 2

    doc1.related.remove_language(doc6)

    for rec in (doc1, doc9):
        assert len(rec.related.languages) == 1
    assert len(doc6.related.languages) == 0

    for rec in (doc6, doc7, doc8):
        assert len(rec.related.editions) == 2

    ser5.related.remove_edition(doc3)

    for rec in (doc1, doc2, doc4, ser5):
        assert len(rec.related.editions) == 3
    assert len(doc3.related.editions) == 0


def test_dump_related_records(testdata):
    """Test dumping related records."""
    doc1 = Document.get_record_by_pid(testdata["documents"][0]["document_pid"])
    doc2 = Document.get_record_by_pid(testdata["documents"][1]["document_pid"])
    doc3 = Document.get_record_by_pid(testdata["documents"][2]["document_pid"])
    assert doc1["related_records"] == []
    assert doc2["related_records"] == []
    assert doc3["related_records"] == []

    doc1.related.add_language(doc2)
    doc1.commit()

    doc1 = Document.get_record_by_pid(doc1[doc1.pid_field])
    doc2 = Document.get_record_by_pid(doc2[doc2.pid_field])
    assert doc1["related_records"] == [
        record_to_relation_dump(doc2, RelatedRecords.language_relation())
    ]
    assert doc2["related_records"] == [
        record_to_relation_dump(doc1, RelatedRecords.language_relation())
    ]

    doc1.related.add_language(doc3)
    doc1.commit()

    doc1 = Document.get_record_by_pid(doc1[doc1.pid_field])
    doc2 = Document.get_record_by_pid(doc2[doc2.pid_field])
    doc3 = Document.get_record_by_pid(doc3[doc3.pid_field])
    assert doc1["related_records"] == [
        record_to_relation_dump(doc2, RelatedRecords.language_relation()),
        record_to_relation_dump(doc3, RelatedRecords.language_relation())
    ]
    assert doc2["related_records"] == [
        record_to_relation_dump(doc1, RelatedRecords.language_relation()),
        record_to_relation_dump(doc3, RelatedRecords.language_relation())
    ]
    assert doc3["related_records"] == [
        record_to_relation_dump(doc1, RelatedRecords.language_relation()),
        record_to_relation_dump(doc2, RelatedRecords.language_relation())
    ]

    doc1.related.remove_language(doc2)
    doc1.related.remove_language(doc3)
    doc1.commit()

    doc1 = Document.get_record_by_pid(doc1[doc1.pid_field])
    doc2 = Document.get_record_by_pid(doc2[doc2.pid_field])
    doc3 = Document.get_record_by_pid(doc3[doc3.pid_field])
    assert doc1["related_records"] == []
    assert doc2["related_records"] == []
    assert doc3["related_records"] == []


def test_related_remove_parent(testdata):
    """Test remove parent."""
    pid1 = testdata["documents"][0]["document_pid"]
    pid2 = testdata["documents"][1]["document_pid"]
    pid3 = testdata["documents"][2]["document_pid"]

    doc1 = Document.get_record_by_pid(pid1)
    doc2 = Document.get_record_by_pid(pid2)
    doc3 = Document.get_record_by_pid(pid3)

    doc1.related.add_edition(doc2)
    doc1.related.add_edition(doc3)
    doc1.commit()

    doc1 = Document.get_record_by_pid(pid1)
    doc2 = Document.get_record_by_pid(pid2)
    doc3 = Document.get_record_by_pid(pid3)
    assert len(doc1.related.editions) == 2
    assert len(doc2.related.editions) == 2
    assert len(doc3.related.editions) == 2

    with pytest.raises(RelatedRecordError):
        doc2.related.remove_edition(doc1)
        doc2.commit()

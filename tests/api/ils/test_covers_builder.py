# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Tests for covers_builder module."""

from unittest.mock import patch

from invenio_app_ils.literature.covers_builder import (
    build_ils_demo_cover_urls,
    build_openlibrary_urls,
    build_placeholder_urls,
)


def test_build_openlibrary_urls():
    """Test Open Library URL generation."""
    isbn = "9780306406157"
    result = build_openlibrary_urls(isbn)

    assert result["is_placeholder"] is False
    assert isbn in result["small"]
    assert isbn in result["medium"]
    assert isbn in result["large"]
    assert "covers.openlibrary.org" in result["small"]
    assert result["small"] == f"https://covers.openlibrary.org/b/isbn/{isbn}-S.jpg"
    assert result["medium"] == f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg"
    assert result["large"] == f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"


@patch("invenio_app_ils.literature.covers_builder.url_for")
def test_build_placeholder_urls(mock_url_for):
    """Test placeholder URL generation."""
    mock_url_for.return_value = "https://example.com/static/images/placeholder.png"

    result = build_placeholder_urls()

    assert result["is_placeholder"] is True
    assert "placeholder.png" in result["small"]
    assert result["small"] == result["medium"] == result["large"]
    mock_url_for.assert_called_once()


def test_build_ils_demo_cover_urls_with_isbn_in_cover_metadata():
    """Test with ISBN in cover_metadata (uppercase)."""
    metadata = {"cover_metadata": {"ISBN": "9780306406157"}}
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is False
    assert "9780306406157" in result["small"]


def test_build_ils_demo_cover_urls_with_isbn_lowercase():
    """Test with isbn in cover_metadata (lowercase)."""
    metadata = {"cover_metadata": {"isbn": "9780306406157"}}
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is False
    assert "9780306406157" in result["small"]


def test_build_ils_demo_cover_urls_with_isbn_in_root():
    """Test with isbn directly in metadata root."""
    metadata = {"isbn": "9780306406157"}
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is False
    assert "9780306406157" in result["small"]


def test_build_ils_demo_cover_urls_with_isbn_in_identifiers():
    """Test with ISBN in identifiers array."""
    metadata = {
        "identifiers": [
            {"scheme": "DOI", "value": "10.1234/example"},
            {"scheme": "ISBN", "value": "9780306406157"},
        ]
    }
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is False
    assert "9780306406157" in result["small"]


@patch("invenio_app_ils.literature.covers_builder.url_for")
def test_build_ils_demo_cover_urls_no_isbn(mock_url_for):
    """Test fallback to placeholder when no ISBN found."""
    mock_url_for.return_value = "https://example.com/static/images/placeholder.png"

    metadata = {
        "title": "Some Book",
        "identifiers": [{"scheme": "DOI", "value": "10.1234/example"}],
    }
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is True
    assert "placeholder.png" in result["small"]


@patch("invenio_app_ils.literature.covers_builder.url_for")
def test_build_ils_demo_cover_urls_empty_metadata(mock_url_for):
    """Test with empty metadata."""
    mock_url_for.return_value = "https://example.com/static/images/placeholder.png"

    metadata = {}
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is True


def test_build_ils_demo_cover_urls_priority_order():
    """Test ISBN priority: cover_metadata.ISBN > cover_metadata.isbn > metadata.isbn > identifiers."""
    # cover_metadata.ISBN should take priority
    metadata = {
        "cover_metadata": {"ISBN": "1111111111"},
        "isbn": "2222222222",
        "identifiers": [{"scheme": "ISBN", "value": "3333333333"}],
    }
    result = build_ils_demo_cover_urls(metadata)
    assert "1111111111" in result["small"]

    # cover_metadata.isbn should be second priority
    metadata = {
        "cover_metadata": {"isbn": "4444444444"},
        "isbn": "2222222222",
        "identifiers": [{"scheme": "ISBN", "value": "3333333333"}],
    }
    result = build_ils_demo_cover_urls(metadata)
    assert "4444444444" in result["small"]

    # metadata.isbn should be third priority
    metadata = {
        "isbn": "5555555555",
        "identifiers": [{"scheme": "ISBN", "value": "3333333333"}],
    }
    result = build_ils_demo_cover_urls(metadata)
    assert "5555555555" in result["small"]

    # identifiers should be last priority
    metadata = {"identifiers": [{"scheme": "ISBN", "value": "6666666666"}]}
    result = build_ils_demo_cover_urls(metadata)
    assert "6666666666" in result["small"]


def test_build_ils_demo_cover_urls_empty_isbn_strings():
    """Test that empty ISBN strings are handled correctly."""
    metadata = {
        "cover_metadata": {"ISBN": "", "isbn": ""},
        "isbn": "",
        "identifiers": [{"scheme": "ISBN", "value": "9780306406157"}],
    }
    result = build_ils_demo_cover_urls(metadata)

    assert result["is_placeholder"] is False
    assert "9780306406157" in result["small"]

#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for ILS stats."""

import pytest
from invenio_stats import current_stats


@pytest.fixture()
def empty_event_queues():
    """Make sure the event queues exist and are empty."""
    for event in current_stats.events:
        queue = current_stats.events[event].queue
        queue.queue.declare()
        queue.consume()

@pytest.fixture()
def with_stats_index_extensions(app):
    """Enable indices to be extended with stats data."""
    app.config["ILS_EXTEND_INDICES_WITH_STATS_ENABLED"] = True
    yield
    app.config["ILS_EXTEND_INDICES_WITH_STATS_ENABLED"] = False



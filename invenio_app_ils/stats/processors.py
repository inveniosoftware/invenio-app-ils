# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details

"""ILS stats preprocessors."""


def add_record_change_ids(doc):
    """Add unique_id and aggregation_id to the doc."""

    # Incorporate the pid_value so that unique changes are detected
    # In the case of e.g. the cds-ils importer creating many eitems at once,
    # the truncation of the timestamp performed by invenio stats would falsely deduplicate them
    doc["unique_id"] = (
        f"{doc.get('pid_value')}__{doc.get('pid_type')}__{doc.get('method')}__{doc.get('user_id')}"
    )

    # We use this field to group by during aggregation
    doc["aggregation_id"] = (
        f"{doc.get('pid_type')}__{doc.get('method')}__{doc.get('user_id')}"
    )

    return doc

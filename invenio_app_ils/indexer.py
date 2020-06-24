# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

import json
import uuid

from flask import current_app
from invenio_indexer.api import RecordIndexer

indexer = RecordIndexer()


class ReferencedRecordsIndexer:
    """Indexer with logging."""

    name = "referenced_records_indexer"
    _uuid = str(uuid.uuid4())

    def log(self, indexed, referenced, before=True):
        """Log indexing action."""
        structured_msg = dict(
            name=self.name,
            uuid=self._uuid,
            action="before_indexing" if before else "after_indexing",
            origin=dict(
                pid_type=indexed["pid_type"],
                pid_value=indexed["record"]["pid"]
            ),
            referenced=dict(
                pid_type=referenced["pid_type"],
                pid_value=referenced["record"]["pid"]
            )
        )
        current_app.logger.info(json.dumps(structured_msg, sort_keys=True))

    def index(self, indexed, referenced):
        """Index record logging action before and after.

        :param indexed: origin record indexed. A dict containing `pid_type`
            and `record` keys.
        :param referenced: referenced records to index. A list of dicts
            containing `pid_type` and `record` keys of the records that will
            be indexed.
        """
        for r in referenced:
            self.log(indexed, r)
            record_to_index = r["record"]
            indexer.index(record_to_index)
            self.log(indexed, r, before=False)

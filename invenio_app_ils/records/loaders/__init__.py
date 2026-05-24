# SPDX-FileCopyrightText: 2018-2019 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS loaders."""

from invenio_records_rest.loaders import marshmallow_loader
from invenio_records_rest.loaders.marshmallow import MarshmallowErrors


def ils_marshmallow_loader(schema_class):
    """Marshmallow loader for JSON requests."""

    def json_loader():
        try:
            return marshmallow_loader(schema_class)()
        except MarshmallowErrors as me:
            for error in me.errors:
                parent_path = [str(x) for x in error["parents"]]
                error["field"] = ".".join([*parent_path, error["field"]])
            raise me

    return json_loader

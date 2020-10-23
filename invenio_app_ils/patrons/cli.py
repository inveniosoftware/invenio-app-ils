# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Patrons CLI module."""

from pprint import pprint

import click
from flask.cli import with_appcontext

from .anonymization import anonymize_patron_data, get_patron_activity
from .indexer import reindex_patrons


@click.group()
def patrons():
    """Patrons data CLI."""


@patrons.command()
@with_appcontext
def index():
    """Reindex all patrons."""
    click.secho("Started reindexing patrons...", fg="green")
    n_patrons = reindex_patrons()
    click.secho("Reindexed {} patrons".format(n_patrons), fg="green")


@patrons.command()
@click.option("--patron-pid", help="Give patron pid.")
@with_appcontext
def list_activity(patron_pid):
    """List patron's data and activity."""
    patron_activity = get_patron_activity(patron_pid)
    if not patron_activity:
        print("The patron with pid", patron_pid, "does not exist.")
        return

    pprint(patron_activity)


@patrons.command()
@click.option("--patron-pid", help="Give patron pid.")
@click.option(
    "--force",
    is_flag=True,
    default=False,
    help="Try to anonymize data by using the given patron PID even if "
    "the Invenio user does not exist.",
)
@with_appcontext
def anonymize(patron_pid, force):
    """Anonymize patron's data and activity."""
    if click.confirm("Are you sure you want to anonymize this patron?"):
        dropped, indices = anonymize_patron_data(patron_pid, force)
        msg = (
            "Successfully anonymized patron's activity: {dropped} rows "
            "deleted from db and {indices} records re-indexed.".format(
                dropped=dropped, indices=indices
            )
        )
        click.secho(msg, fg="green")

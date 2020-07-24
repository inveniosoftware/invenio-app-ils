# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabularies CLI module."""

import json

import click
from flask import current_app
from flask.cli import with_appcontext

from .api import (VOCABULARY_PID_TYPE, delete_vocabulary_from_index,
                  load_vocabularies)


@click.group()
def vocabulary():
    """Vocabulary CLI."""
    pass


@vocabulary.group()
def index():
    """Index vocabularies in Elasticsearch."""
    pass


@index.command(name="json")
@click.option("--force", is_flag=True)
@click.argument("filenames", nargs=-1)
@with_appcontext
def index_json(filenames, force):
    """Index JSON-based vocabularies in Elasticsearch."""
    if not force:
        click.confirm(
            "Are you sure you want to index the vocabularies?",
            abort=True
        )
    source = "json"
    index_count = 0
    for filename in filenames:
        click.echo('indexing vocabularies in {}...'.format(filename))
        vocabularies = load_vocabularies(source, filename)
        cfg = current_app.config["RECORDS_REST_ENDPOINTS"][VOCABULARY_PID_TYPE]
        indexer = cfg["indexer_class"]()
        with click.progressbar(vocabularies) as bar:
            for vocabulary in bar:
                indexer.index(vocabulary)
        index_count += len(vocabularies)
    click.echo('indexed {} vocabularies'.format(index_count))


@index.command(name="opendefinition")
@click.argument("loader")
@click.option("--path", default=None)
@click.option(
    "--whitelist-status",
    default=None,
    help="Comma-separated list of whitelisted statuses."
)
@click.option("--force", is_flag=True)
@with_appcontext
def index_opendefinition(loader, path, whitelist_status, force):
    """Index JSON-based vocabularies in Elasticsearch."""
    if not force:
        click.confirm(
            "Are you sure you want to index the vocabularies?",
            abort=True
        )
    index_count = 0
    click.echo('indexing licenses from loader {} and path {}...'.format(
        loader,
        path
    ))
    if whitelist_status:
        whitelist_status = whitelist_status.split(",")
    vocabularies = load_vocabularies(
        "opendefinition", loader, path, whitelist_status
    )
    cfg = current_app.config["RECORDS_REST_ENDPOINTS"][VOCABULARY_PID_TYPE]
    indexer = cfg["indexer_class"]()
    with click.progressbar(vocabularies) as bar:
        for vocabulary in bar:
            indexer.index(vocabulary)
    index_count += len(vocabularies)
    click.echo('indexed {} licenses'.format(index_count))


@vocabulary.group()
def generate():
    """Generate vocabulary files."""
    pass


@generate.command()
@click.option("--output", "-o", default="countries.json")
def countries(output):
    """Generate JSON file containing all countries."""
    import pycountry

    results = []
    for country in pycountry.countries:
        results.append({
            "type": "country",
            "key": country.alpha_2,
            "text": "{} ({})".format(country.name, country.alpha_2),
        })
    with open(output, "w+") as f:
        json.dump(results, f, sort_keys=True, indent=2)
        click.echo("stored {} countries in {}".format(len(results), output))


@generate.command()
@click.option("--output", "-o", default="languages.json")
def languages(output):
    """Generate JSON file containing all languages."""
    import pycountry

    results = []
    for lang in pycountry.languages:
        if hasattr(lang, "alpha_2"):
            results.append({
                "type": "language",
                "key": lang.alpha_2.upper(),
                "text": "{} ({})".format(lang.name, lang.alpha_2),
            })
    with open(output, "w+") as f:
        json.dump(results, f, sort_keys=True, indent=2)
        click.echo("stored {} languages in {}".format(len(results), output))


@vocabulary.command()
@click.argument("type")
@click.option("--force", is_flag=True)
@click.option("--key", "-k", default=None, help="Remove specific key")
@with_appcontext
def delete(type, force, key):
    """Delete indexed vocabularies."""
    count = delete_vocabulary_from_index(type=type, force=force, key=key)

    if not force:
        if count == 0:
            click.secho("No vocabularies found. Exiting.")
            exit(1)
        if click.confirm(
            "You are about to delete {} vocabularies of type '{}'. "
            "Do you want to continue?".format(count, type),
            abort=True
        ):
            count = delete_vocabulary_from_index(
                type=type, force=True, key=key)

    click.echo('deleted {} vocabularies'.format(count))

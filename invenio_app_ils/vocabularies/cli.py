# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabularies CLI module."""

import json

import click
from flask.cli import with_appcontext

from ..proxies import current_app_ils
from .api import (
    VOCABULARY_TYPE_COUNTRY,
    VOCABULARY_TYPE_LANGUAGE,
    delete_vocabulary_from_index,
    load_vocabularies,
)


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
        click.confirm("Are you sure you want to index the vocabularies?", abort=True)
    source = "json"
    index_count = 0
    for filename in filenames:
        click.echo("indexing vocabularies in {}...".format(filename))
        vocabularies = load_vocabularies(source, filename)
        indexer = current_app_ils.vocabulary_indexer
        with click.progressbar(vocabularies) as bar:
            for vocabulary in bar:
                indexer.index(vocabulary)
        index_count += len(vocabularies)
    click.echo("indexed {} vocabularies".format(index_count))


@index.command(name="languages")
@click.option("--force", is_flag=True)
@with_appcontext
def index_languages(force):
    """Index languages in Elasticsearch."""
    import pycountry

    if not force:
        click.confirm("Are you sure you want to index the languages?", abort=True)
    index_count = 0
    click.echo("indexing languages...")

    Vocabulary = current_app_ils.vocabulary_record_cls
    indexer = current_app_ils.vocabulary_indexer
    with click.progressbar(pycountry.languages) as bar:
        for lang in bar:
            if hasattr(lang, "alpha_3") and hasattr(lang, "alpha_2"):
                lang_dict = {
                    "type": VOCABULARY_TYPE_LANGUAGE,
                    "key": lang.alpha_3.upper(),
                    "text": "{} ({})".format(lang.name, lang.alpha_3),
                }
                lang_rec = Vocabulary(**lang_dict)
                indexer.index(lang_rec)
                index_count += 1

    click.echo("indexed {} languages".format(index_count))


@index.command(name="opendefinition")
@click.argument("loader")
@click.option("--path", default=None)
@click.option(
    "--whitelist-status",
    default=None,
    help="Comma-separated list of whitelisted statuses.",
)
@click.option("--force", is_flag=True)
@with_appcontext
def index_opendefinition(loader, path, whitelist_status, force):
    """Index JSON-based vocabularies in Elasticsearch."""
    if not force:
        click.confirm("Are you sure you want to index the vocabularies?", abort=True)
    index_count = 0
    click.echo("indexing licenses from loader {} and path {}...".format(loader, path))
    if whitelist_status:
        whitelist_status = whitelist_status.split(",")
    vocabularies = load_vocabularies("opendefinition", loader, path, whitelist_status)
    indexer = current_app_ils.vocabulary_indexer
    with click.progressbar(vocabularies) as bar:
        for vocabulary in bar:
            indexer.index(vocabulary)
    index_count += len(vocabularies)
    click.echo("indexed {} licenses".format(index_count))


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
        results.append(
            {
                "type": VOCABULARY_TYPE_COUNTRY,
                "key": country.alpha_3,
                "text": "{} ({})".format(country.name, country.alpha_3),
            }
        )
    with open(output, "w+") as f:
        json.dump(results, f, sort_keys=True, indent=2)
        click.echo("stored {} countries in {}".format(len(results), output))


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
            abort=True,
        ):
            count = delete_vocabulary_from_index(type=type, force=True, key=key)

    click.echo("deleted {} vocabularies".format(count))

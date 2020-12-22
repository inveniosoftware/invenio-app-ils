#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

# To run a test locally:
# 1. eval "$(docker-services-cli up --db postgresql12 --search elasticsearch7 --cache redis --env)"
# 2. python -m pytest -svvvv tests/api/ils/test_apis.py
# 3. eval "$(docker-services-cli down --env)"

# Quit on errors
set -o errexit

# Quit on unbound symbols
set -o nounset

# Quit if no tests folder provided
if [ $# -eq 0 ]; then
    echo "No tests folder provided"
    exit 1
fi

# Always bring down docker services
function cleanup() {
    eval "$(docker-services-cli down --env)"
}
trap cleanup EXIT

python -m check_manifest --ignore ".*-requirements.txt"
python -m sphinx.cmd.build -qnNW docs docs/_build/html
eval "$(docker-services-cli up --db ${DB:-postgresql} --search ${SEARCH:-elasticsearch} --cache ${CACHE:-redis} --env)"
python -m pytest tests/api/$1
tests_exit_code=$?
python -m sphinx.cmd.build -qnNW -b doctest docs docs/_build/doctest
exit "$tests_exit_code"

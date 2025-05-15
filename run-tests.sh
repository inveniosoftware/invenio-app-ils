#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2020-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

# To run a test locally:
# 1. eval "$(docker-services-cli up --db postgresql14 --search opensearch2 --cache redis --mq  rabbitmq --env)"
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

# Check for arguments
# Note: "-k" would clash with "pytest"
keep_services=0
pytest_args=()
test_module=$1
shift;
for arg in $@; do
	# from the CLI args, filter out some known values and forward the rest to "pytest"
	# note: we don't use "getopts" here b/c of some limitations (e.g. long options),
	#       which means that we can't combine short options (e.g. "./run-tests -Kk pattern")
	case ${arg} in
		-K|--keep-services)
			keep_services=1
			;;
		*)
			pytest_args+=( ${arg} )
			;;
	esac
done

# Always bring down docker services
function cleanup() {
    eval "$(docker-services-cli down --env)"
}
trap cleanup EXIT

python -m check_manifest
python -m sphinx.cmd.build -qnNW docs docs/_build/html
eval "$(docker-services-cli up --db ${DB:-postgresql} --search ${SEARCH:-opensearch2} --cache ${CACHE:-redis} --mq ${MQ:-rabbitmq} --env)"
python -m pytest tests/api/${test_module} ${pytest_args[@]+"${pytest_args[@]}"}
tests_exit_code=$?
exit "$tests_exit_code"

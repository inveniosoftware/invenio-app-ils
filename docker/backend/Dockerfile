# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM python:3.6

RUN apt-get update && apt-get upgrade -y && apt-get install apt-file -y && apt-file update
RUN cd /tmp && curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh && bash nodesource_setup.sh
RUN apt-get install -y nodejs git curl vim

# setuptools<58: https://setuptools.pypa.io/en/latest/history.html#v58-0-0
# the `fs` package relies on `2to3`
RUN pip install --upgrade "setuptools<58" wheel pip uwsgi uwsgitop uwsgi-tools

RUN python -m site
RUN python -m site --user-site

# Install Invenio
ENV WORKING_DIR=/opt/invenio_app_ils
ENV INVENIO_INSTANCE_PATH=${WORKING_DIR}/var/instance
ENV INVENIO_STATIC_URL_PATH='/invenio-assets'
ENV INVENIO_STATIC_FOLDER=${INVENIO_INSTANCE_PATH}/invenio-assets

# copy everything inside /src
RUN mkdir -p ${WORKING_DIR}/src
COPY ./ ${WORKING_DIR}/src
WORKDIR ${WORKING_DIR}/src

# Install/create static files
RUN mkdir -p ${INVENIO_INSTANCE_PATH}
RUN mkdir -p ${INVENIO_STATIC_FOLDER}

RUN ./scripts/bootstrap

# Set folder permissions
RUN chgrp -R 0 ${WORKING_DIR} && \
    chmod -R g=u ${WORKING_DIR}

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root ${WORKING_DIR}
USER 1000

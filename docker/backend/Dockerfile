# SPDX-FileCopyrightText: 2018-2020 CERN.
# SPDX-License-Identifier: MIT

FROM ghcr.io/inveniosoftware/invenio:debian-python3.14 

RUN apt-get update -y && apt-get upgrade -y  && apt-get update -y
RUN cd /tmp && curl -sL  https://rpm.nodesource.com/setup_16.x  -o nodesource_setup.sh && bash nodesource_setup.sh
RUN apt-get install -y nodejs git vim

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

RUN chown -R invenio:root ${WORKING_DIR}
USER 1000

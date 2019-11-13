# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM node:10 as react-build

ENV WORKING_DIR=/code

RUN mkdir -p ${WORKING_DIR}/src
COPY ./ ${WORKING_DIR}/src
WORKDIR ${WORKING_DIR}/src

# Install/create static files
RUN npm install && npm run build

FROM node:10 as react-prod

ENV REACT_ASSETS=/opt/invenio_app_ils/react-assets
RUN mkdir -p ${REACT_ASSETS}
COPY --from=react-build /code/src/build ${REACT_ASSETS}

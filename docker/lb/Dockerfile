# SPDX-FileCopyrightText: 2018-2020 CERN.
# SPDX-License-Identifier: MIT

FROM haproxy:2.2
RUN mkdir -p /usr/local/var/lib/haproxy/
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY haproxy_cert.pem /usr/local/etc/cert.pem

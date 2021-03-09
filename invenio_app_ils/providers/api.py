# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Provider API."""

from functools import partial

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord

PROVIDER_PID_TYPE = "provid"
PROVIDER_PID_MINTER = "provid"
PROVIDER_PID_FETCHER = "provid"

ProviderIdProvider = type(
    "ProviderIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=PROVIDER_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
provider_pid_minter = partial(pid_minter, provider_cls=ProviderIdProvider)
provider_pid_fetcher = partial(pid_fetcher, provider_cls=ProviderIdProvider)


class Provider(IlsRecord):
    """Provider class."""

    _pid_type = PROVIDER_PID_TYPE
    _schema = "providers/provider-v1.0.0.json"

    def delete(self, **kwargs):
        """Delete record."""
        order_search_cls = current_ils_acq.order_search_cls
        search_order_res = order_search_cls().search_by_provider_pid(
            self["pid"]
        )

        brwreq_search_cls = current_ils_ill.borrowing_request_search_cls
        search_brwreq_res = brwreq_search_cls().search_by_provider_pid(
            self["pid"]
        )

        if search_order_res.count() or search_brwreq_res.count():
            order_ref_ids = [res["pid"] for res in search_order_res.scan()]
            brwreq_ref_ids = [res["pid"] for res in search_brwreq_res.scan()]

            raise RecordHasReferencesError(
                record_type="Provider",
                record_id=self["pid"],
                ref_type="Order/BorrowingRequest",
                ref_ids=sorted(order_ref_ids + brwreq_ref_ids),
            )
        return super().delete(**kwargs)

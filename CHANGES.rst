..
    Copyright (C) 2018-2020 CERN.

    invenio-app-ils is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.

Changes
=======

Version 1.0.0a24 (released 2021-01-25)

- add internal_note to document request schema
- add validation for series mode of issuance


Version 1.0.0a23 (released 2021-01-18)

- improve ES mapping
- constraint parent child relation to one multipart monograph
- set patron indexer as current_app_ils proxy

Version 1.0.0a22 (released 2021-01-13)

- improve email templating
- add ILL loans extension search filter
- test permissions
- fix eitem filter
- change cover placeholder

Version 1.0.0a21 (released 2020-10-26)

- add library_search_cls as property in current_ils_ill
- add library_indexer as property in current_ils_ill
- bump invenio-circulation version

Version 1.0.0a20 (released 2020-10-11)

- update the constraint on opening hours up to 2 time periods
- add importer curator type
- fix patron resolver bug
- add validation for missing language and edition fields
- fix deletion of remote token

Version 1.0.0a19 (released 2020-10-28)

- fix ils search factory with prefixed indices

Version 1.0.0a18 (released 2020-10-26)

- refactor patrons indexer
- add overridable footer email template
- integrate invenio-banners module
- remove email to send active loans to librarian
- add missing legacy_id fields to various schema

Version 1.0.0a17 (released 2020-10-23)

- fix vocabularies for mediums
- change cron jobs schedule

Version 1.0.0a16 (released 2020-10-20)

- fix simplejson package version

Version 1.0.0a15 (released 2020-10-20)

- update sort configuration
- update ES mappings
- location closure module fixes
- add oai-pmh server configuration
- fixes for celery 5 upgrade

Version 1.0.0a14 (released 2020-10-13)

- refactor anonymization module
- fix loan item replace indexing
- increase rate limit
- add support postgres 12

Version 1.0.0a13 (released 2020-09-29)

- protect stats endpoint when document is restricted
- change schema publication field
- fix send loan reminder on demand
- integrate location closures module

Version 1.0.0a12 (released 2020-09-16)

- bumped invenio-circulation to 1.0.0a27
- allow to edit loans start and end dates
- update license field schema definition in Document
- fix CSP configuration

Version 1.0.0a11 (released 2020-09-04)

- bumped invenio-stats version to 1.0.0a18
- add keywords and tags to series
- enable CSRF support

Version 1.0.0a10 (released 2020-08-13)

- add anonymisation of user accounts and actions
- add sorting values
- add notification emails about unresolved user requests
- fix user roles fetching

Version 1.0.0a9 (released 2020-07-28)

- limit version for dependencies to minor
- add identifiers to e-items
- add new document circulation endpoint
- fix isort v5 imports
- remove ETag/Last-Modified headers

Version 1.0.0a8 (released 2020-07-16)

- add request type and payment method to document request
- change keywords field type

Version 1.0.0a7 (released 2020-07-14)

- add medium field to document request

Version 1.0.0a6 (released 2020-07-03)

- bugfix minters and fetchers for vocabularies and patrons

Version 1.0.0a5 (released 2020-07-01)

- config: remove DEFAULT_LOCATION_PID
- resolvers: bug fix indexing $refs
- dependencies: upgrade
- loan: Base32 PIDs
- cli: option for static pages
- readme: improvements

Version 1.0.0a4 (released 2020-06-19)

- ILL: patron can fetch his own borrowing requests
- document and series metadata extensions
- loan: auto cancel after expiration day

Version 1.0.0a0 (released 2020-06-05)

- Initial public release.

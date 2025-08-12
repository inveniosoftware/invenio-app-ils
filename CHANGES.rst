
..
    Copyright (C) 2018-2024 CERN.

    invenio-app-ils is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.

Changes
=======

Version 5.0.0 (released 2025-08-12)

- breaking changes: upgrade to flask 3
- breaking changes: upgrade to sqlalchemy2
- circulation: added NOT-SPECIFIED delivery method
- circulation: changing loan dates sends out a mail to the patron
- update: rename schema field parameter default to load_default

Version 4.6.0 (released 2025-06-25)

- installation: remove breaking package version constraints

Version 4.5.0 (released 2025-06-04)

- closures: added endpoint for closure periods in a year
- circulation: self-checkout of MISSING items marks them as CAN_CIRCULATE
- tests: Fix comment on running tests by bumping Postgres & adding param

Version 4.4.0 (released 2025-02-21)

- installation: pin invenio-logging

Version 4.3.0 (released 2024-11-19)

- self-checkout: use dedicated endpoints for the entire workflow for better
                 permissions check and error handling.
                 Add a new loan transition and delivery method for self-checkout.
- anonymization: ensure that re-indexing is happening after the commit to the db,
                 to avoid premature re-indexing (and therefore index conflict version)
                 when db rollback happens.

Version 4.2.0 (released 2024-11-04)

- self-checkout: barcode is now always uppercased to make searches case-insensitive

Version 4.1.0 (released 2024-10-21)

- search: apply the same search analyzers to the fields that needs to be searchable.
          This is required when using cross-field searches.
          Re-create the documents and series indices to take advantage of this change.

Version 4.0.0 (released 2024-08-07)

- Initial full release

Version 4.0.0rc1 (released 2024-06-28)

- search: improve search for accents and special characters
          breaking change: requires updating the version of mappings and schema

Version 3.0.0rc5 (released 2024-06-24)

- search: allow custom query parser

Version 3.0.0rc4 (released 2024-06-17)

- serializers: handle PatronNotFound

Version 3.0.0rc3 (released 2024-06-07)

- circulation: Support self checkout by patrons
- Dockerfile: update backend base image python3.6 -> inveniosoftware/almalinux:1

Version 3.0.0rc2 (released 2024-05-28)

- mappings: Add alternative_titles in brwReqs and AcqOrders
- records: loaders: schemas: Move IdentifierSchema from documents
- documents: mappings: Update item identifiers description to scheme

Version 3.0.0rc1 (released 2024-05-13)

- eitems: add required type field to data model (breaking change)
- physical items: add identifiers field
- documents: add MULTIMEDIA document type

Version 2.0.0rc9 (released 2024-04-25)

- patch: add record pid to error display

Version 2.0.0rc8 (released 2024-04-04)

- records_relation: Simplify sorting
- records_relations: Use sort_by parameter from configs instead
- relations: Add functionality to sort json refs by relation_type
- tests: circulation: Add new location for testing closures
- circulation: loan_request: Fix dates comparison in get_offset_duration
- tests: loan request: fix test for minimum days before request
- circulation: Consider closures dates when verifying loan request dates

Version 2.0.0rc7 (released 2024-03-04)

- circulation: Made loan request start date to be configurable and validated at the backend

Version 2.0.0rc6 (released 2024-02-27)

- facets: fix boolean query

Version 2.0.0rc5 (released 2024-02-21)

- facets: fix range query

Version 2.0.0rc4 (released 2024-02-19)

- stats: emit custom signal for file download

Version 2.0.0rc3 (released 2024-02-19)

- facets: fix range post filter

Version 2.0.0rc2 (released 2024-01-12)

- search: fix search factory function signature
- anonymization: fix patron_pid retrieval on acq orders

Version 2.0.0rc1 (released 2024-01-11)

- upgrade python version
- remove ES v7 and below support
- upgrade invenio packages
- upgrade python dependencies

Version 1.0.0rc5 (released 2023-12-20)

- demo data: optional admin account creation

Version 1.0.0rc4 (released 2023-07-04)

- Fix docker-compose file

Version 1.0.0rc3 (released 2023-03-10)

- Remove ES v6 mappings

Version 1.0.0rc2 (released 2023-03-07)

- add opensearch docker image
- add opensearch v1 and v2 mappings
- remove doc type to enable opensearch2 compatibility
- bump invenio-stats and invenio-indexer to opensearch2 compatible versions
- bump invenio-circulation to opensearch-compatible alpha release
- remove ES6 mappings

Version 1.0.0rc1 (released 2022-10-24)

- first release candidate

Version 1.0.0a69 (released 2022-10-18)

- adapt literature search query

Version 1.0.0a68 (released 2022-10-06)

- bump pycountry

Version 1.0.0a67 (released 2022-09-15)

- removes ES6 support

Version 1.0.0a66 (released 2022-08-24)

- allows vocabularies values to be queried via REST API

Version 1.0.0a65 (released 2022-08-16)

- fix mappings for documents volume field

Version 1.0.0a64 (released 2022-08-12)

- fix redirection page after logout
- add copy to field for volume

Version 1.0.0a63 (released 2022-05-05)

- document: preserve legacy_recid on update as int
- series: preserve legacy_recid on update as int

Version 1.0.0a62 (released 2022-05-02)

- document: preserve legacy_recid on update

Version 1.0.0a61 (released 2022-02-21)

- Pin `itsdangerous` because v2.1.0 removes `TimedJSONWebSignatureSerializer`

Version 1.0.0a60 (released 2022-02-21)

- upgrade invenio-opendefinition

Version 1.0.0a59 (released 2022-01-17)

- add alternative mappings to text fields in documents e-items and series

Version 1.0.0a58 (released 2021-12-17)

- add words length limiter on document author name indexing
- add case insensitive search on document publisher

Version 1.0.0a57 (released 2021-12-01)

- global: fix installation issues by dependencies

Version 1.0.0a56 (released 2021-11-12)

- Bulk loan extension: add overdue loans to bulk extend functionality

Version 1.0.0a55 (released 2021-11-05)

- search: add normalised keyword search to support case insensitive exact match

Version 1.0.0a54 (released 2021-10-20)

- literature search: improved relevance of results
- Search Guide: add search guide static page

Version 1.0.0a53 (released 2021-10-05)

- bulk extend: supress sending notification on empty extended loans set

Version 1.0.0a52 (released 2021-10-01)

- update invenio circulation

Version 1.0.0a51 (released 2021-09-30)

- add bulk loan extension feature

Version 1.0.0a50 (released 2021-09-27)

- add notifications module with configurable backends

Version 1.0.0a49 (released 2021-09-27)

- document: fix loan calculation on the resolver
- change country codes to 3-letter standard

Version 1.0.0a48 (released 2021-08-31)

- documents: add text field to mapping of conference place
- loans: reindex all the pending loans on the parent when updating one of them

Version 1.0.0a47 (released 2021-07-29)

- document api: add discrete references search
- eitem: add source field and vocab

Version 1.0.0a46 (released 2021-07-07)

- relations: fix related record deletion

Version 1.0.0a45 (released 2021-07-07)

- series: add dependency check on delete action
- fix python dependencies resolution

Version 1.0.0a44 (released 2021-06-02)

- add identifiers text mapping field
- add checks on dependencies of documents on delete

Version 1.0.0a43 (released 2021-05-27)

- add document type to item index and facets

Version 1.0.0a42 (released 2021-05-17)

- boost search results for identifier fields

Version 1.0.0a41 (released 2021-05-12)

- send expiring loans reminder only once
- fix Flask and werkzeug version conflicts via invenio-app

Version 1.0.0a40 (released 2021-05-07)

- document request add missing email template
- eliminate stale loan requests

Version 1.0.0a39 (released 2021-05-05)

- bump invenio-circulation package version
- reindex all document referenced loans on item indexing

Version 1.0.0a38 (released 2021-04-13)

- rename e-books vocabularies values
- rename availability facet

Version 1.0.0a37 (released 2021-04-09)

- do not require order date in acquisition

Version 1.0.0a36 (released 2021-04-07)

- add login required to series access_urls

Version 1.0.0a35 (released 2021-04-07)

- add series type field to series schema
- add item circulation statistics to loan search index

Version 1.0.0a34 (released 2021-03-29)

- Updates default loan extension

Version 1.0.0a33 (released 2021-03-18)

- series: remove electronic volumes description field

Version 1.0.0a32 (released 2021-03-16)

- change license vocabulary to use resolver
- rename proceedings and ebooks
- prepare strings to be inserted in HTML

Version 1.0.0a31 (released 2021-03-12)

- add volumes description fields to series
- change conference field type

Version 1.0.0a30 (released 2021-03-10)

- replace vendors and external libraries with provider record type
- fix document extensions data schema
- fix internal search queries
- add publisher field to document request

Version 1.0.0a29 (released 2021-03-04)

- update borrowing request schema
- fix circulation restrictions
- fix author limit on resolvers
- fix currency vocabulary
- add html formatting to the email templates
- add meta field to document urls
- add email logging in DB

Version 1.0.0a28 (released 2021-02-16)

- add cookies config for improved security
- fix data model extensions facets
- adapt document data model field physical_description
- fixes for literature request API

Version 1.0.0a27 (released 2021-02-10)

- fix max_result_window config
- restrict system emails from sending to system agents

Version 1.0.0a26 (released 2021-02-09)

- fix max_result_window config for searches
- fix boosted search factories for ES v<7.7 compatibility

Version 1.0.0a25 (released 2021-02-02)

- update invenio to 3.4
- change language standard to ISO 639-3
- change eitem urls access_restriction field
- add item availability to loan search


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

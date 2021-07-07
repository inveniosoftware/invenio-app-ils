
..
    Copyright (C) 2018-2020 CERN.

    invenio-app-ils is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.

Changes
=======

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

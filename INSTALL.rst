..
    Copyright (C) 2018 CERN.

    invenio-app-ils is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.

Installation
============

First, create a `virtualenv <https://virtualenv.pypa.io/en/stable/installation/>`_
using `virtualenvwrapper <https://virtualenvwrapper.readthedocs.io/en/latest/install.html>`_
in order to sandbox our Python environment for development:

.. code-block:: console

    $ mkvirtualenv my-site

Start all dependent services using docker-compose (this will start PostgreSQL,
Elasticsearch 6, RabbitMQ and Redis):

.. code-block:: console

    $ docker-compose up -d

.. note::

    Make sure you have `enough virtual memory
    <https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-prod-mode>`_
    for Elasticsearch in Docker:

    .. code-block:: shell

        # Linux
        $ sysctl -w vm.max_map_count=262144

        # macOS
        $ screen ~/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux/tty
        <enter>
        linut00001:~# sysctl -w vm.max_map_count=262144


Next, bootstrap the instance (this will install all Python dependencies and
build all static assets):

.. code-block:: console

    $ ./scripts/bootstrap

Next, create database tables, search indexes and message queues:

.. code-block:: console

    $ ./scripts/setup

Running
-------
Start the webserver:

.. code-block:: console

    $ ./scripts/server

Start the a background worker:

.. code-block:: console

    $ celery worker -A invenio_app.celery -l INFO

Start a Python shell:

.. code-block:: console

    $ ./scripts/console

Upgrading
---------
In order to upgrade an existing instance simply run:

.. code-block:: console

    $ ./scripts/update

Testing
-------
Run the test suite via the provided script:

.. code-block:: console

    $ ./run-tests.sh

By default, end-to-end tests are skipped. You can include the E2E tests like
this:

.. code-block:: console

    $ env E2E=yes ./run-tests.sh

For more information about end-to-end testing see `pytest-invenio
<https://pytest-invenio.readthedocs.io/en/latest/usage.html#running-e2e-tests>`_

Documentation
-------------
You can build the documentation with:

.. code-block:: console

    $ python setup.py build_sphinx

UI Development
--------------

The user interface is a standalone React application created using
[create-react-app](https://facebook.github.io/create-react-app/).
The easiest development setup consists in starting separately Invenio, for REST APIs, and the React app using the
create-react-app webserver.

First of all, you have to create your own personal access token, to be able to GET or POST data to the API:

* start the backend server:

    .. code-block:: console

        $ ./scripts/server

* start the ui server:

    .. code-block:: console

        $ cd ./ui && npm start

* If you run invenio in an port other than `5000` you need to run the below commands:

    .. code-block:: console

        $ echo 'REACT_APP_BACKEND_DEV_BASE_URL=https://localhost:<your-new-port>' > ./invenio_app_ils/ui/.env.development
        $ echo 'REACT_APP_BACKEND_DEV_BASE_URL=https://localhost:<your-new-port>' > ./invenio_app_ils/ui/.env.test


* | since the React app is server under a different port (normally, :3000), you
  | need to configure Invenio to allow requests from different domains. In your
  | virtual environment navigate to ``~/.virtualenvs/ils/var/instance``, if there
  | is no file ``invenio.cfg`` create one and add the following configuration,
  | which will override the existing configuration we have in ``config.py``

    .. code-block:: python

        CORS_SEND_WILDCARD = False
        CORS_SUPPORTS_CREDENTIALS = True


Production environment
----------------------
You can use simulate a full production environment using the
``docker-compose.full.yml``. You can start it like this:

.. code-block:: console

    $ docker-compose -f docker-compose.full.yml up -d

In addition to the normal ``docker-compose.yml``, this one will start:

- HAProxy (load balancer)
- Nginx (web frontend)
- UWSGI (application container)
- Celery (background task worker)
- Flower (Celery monitoring)


Vocabularies
------------
Vocabularies are indexed using Elasticsearch and can be indexed from a JSON
source file. To manage vocabularies use the ``ils vocabulary`` CLI.

Some pre-defined vocabulary generators are available. To generate a JSON file
with a list of languages or countries use:

    .. code-block:: console

        ils vocabulary generate languages -o languages.json
        ils vocabulary generate countries -o countries.json

To add vocabularies from a JSON file use the ``index`` command:

    .. code-block:: console

        ils vocabulary index json [file1.json, file2.json, ...]

To add custom vocabularies or modify the text or data of an existing vocabulary
use the same ``index`` command as above.

If you change the ``key`` attribute of a vocabulary or if you remove a vocabulary
you also need to remove it from Elasticsearch. Use the ``delete`` command to
remove a vocabulary:

    .. code-block:: console

        ils vocabulary delete country  # remove all countries
        ils vocabulary delete country --key CH  # remove only Switzerland

Example vocabularies are available in ``invenio_app_ils/vocabularies/data``.

Vocabulary-specific configuration is available in ``config.py`` and ``invenioConfig.js``.


CERN OAUTH DEVELOPMENT SETUP (Without docker)
---------------------------------------------
After following the instructions described [here](https://digital-repositories.web.cern.ch/digital-repositories/common-recipes/cern-oauth/)
for setting up the cern oauth locally, you need to follow the next steps in order to
make the ui application work:

* Create a file `.env.development.local` and add the following line

    .. code-block:: console
        REACT_APP_BACKEND_DEV_BASE_URL=https://<hostname>.dyndns.cern.ch:5000

  You must put in the <hostname> part your laptop's hostname at CERN.

* Open the `config.py` and replase the following lines

    .. code-block:: console
        OAUTH_REMOTE_APP["authorized_redirect_url"] = 'http://<hostname>.dyndns.cern.ch:3000/login'
        OAUTH_REMOTE_APP["error_redirect_url"] = 'http://<hostname>.dyndns.cern.ch:3000/login'

* Add your hostname in the `APP_ALLOWED_HOSTS` config variable


CSRF ENABLE DEVELOPMENT SETUP (Without docker)
----------------------------------------------
If you have enabled the csrf check during development, you need to follow one of the below steps in order to be able to make it work:

1) Run the ui app with `npm run start:secure`. This will run the react application over `https` and the csrf cookie will be corectly set.
2) If you run the ui app over `http` then you need to add in the `config.py` file the following lines:

.. code-block:: console
    CSRF_FORCE_SECURE_REFERRER = False
    SESSION_COOKIE_SECURE = False

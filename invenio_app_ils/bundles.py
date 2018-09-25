from __future__ import absolute_import, division, print_function

from flask_assets import Bundle
from invenio_assets import NpmBundle

js = NpmBundle(
    "js/invenio_app_ils/main.js",
    output="gen/invenio_app_ils.%(version)s.js",
)

css = Bundle(
    Bundle(
        "css/invenio_app_ils/main.css",
        filters='cleancssurl',
    ),
    output='gen/invenio_app_ils.%(version)s.css'
)
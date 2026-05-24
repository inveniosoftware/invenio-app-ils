# SPDX-FileCopyrightText: 2025 CERN.
# SPDX-License-Identifier: MIT

"""JS/CSS Webpack bundles for theme."""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            aliases={
                # Define Semantic-UI theme configuration needed by
                # Invenio-Theme in order to build Semantic UI (in theme.js
                # entry point)
                # This is a workaround for invenio-app-ils until a better solution is found
                "../../theme.config$": "less/theme.config",
            },
        ),
    },
)

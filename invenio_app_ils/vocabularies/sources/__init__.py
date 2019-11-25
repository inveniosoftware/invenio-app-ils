# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabulary sources module."""

from .json import JSONVocabularySource
from .opendefinition import OpenDefinitionVocabularySource

json_source = JSONVocabularySource
opendefinition_source = OpenDefinitionVocabularySource

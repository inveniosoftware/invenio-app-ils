# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Vocabulary sources module."""

from .json import JSONVocabularySource
from .opendefinition import OpenDefinitionVocabularySource

json_source = JSONVocabularySource
opendefinition_source = OpenDefinitionVocabularySource

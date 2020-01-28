import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';
import { recordToPidType } from '@api/utils';
import { DocumentListEntry } from '@pages/frontsite/Documents/DocumentsSearch/DocumentListEntry';
import { SeriesListEntry } from '@pages/frontsite/Documents/DocumentsSearch/SeriesListEntry';
import { findVolume } from '..';

export const SeriesLiteratureResultsList = ({ metadata, results }) => {
  return (
    <Item.Group>
      {results.map(result => {
        const volume = findVolume(result, metadata ? metadata.pid : null);
        return recordToPidType(result) === 'docid' ? (
          <DocumentListEntry
            key={result.metadata.pid}
            data-test={result.metadata.pid}
            metadata={result.metadata}
            volume={volume}
          />
        ) : (
          <SeriesListEntry
            key={result.metadata.pid}
            data-test={result.metadata.pid}
            metadata={result.metadata}
            volume={volume}
          />
        );
      })}
    </Item.Group>
  );
};

SeriesLiteratureResultsList.propTypes = {
  metadata: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
};

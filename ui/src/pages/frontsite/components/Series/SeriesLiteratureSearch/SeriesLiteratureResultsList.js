import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { recordToPidType } from '@api/utils';
import { DocumentListEntry } from '@pages/frontsite/Documents/DocumentsSearch/DocumentListEntry';
import { SeriesListEntry } from '@pages/frontsite/Documents/DocumentsSearch/SeriesListEntry';
import { findVolume } from '..';
import { ResultsList } from 'react-searchkit';

export default class DocumentSearchResultsList extends Component {
  renderResultsList = results => {
    return results.length ? (
      <Item.Group>
        {results.map(result => {
          const volume = findVolume(
            result,
            result.metadata ? result.metadata.pid : null
          );
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
    ) : null;
  };

  render() {
    return <ResultsList renderElement={this.renderResultsList} />;
  }
}

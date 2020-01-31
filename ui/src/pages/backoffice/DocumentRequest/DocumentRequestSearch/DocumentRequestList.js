import { DocumentRequestListEntry } from './DocumentRequestListEntry';
import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { SearchEmptyResults } from '@components/SearchControls';

export default class DocumentRequestList extends Component {
  renderListEntry = documentRequest => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(documentRequest);
    }
    return (
      <DocumentRequestListEntry
        key={documentRequest.metadata.pid}
        documentRequest={documentRequest}
      />
    );
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults />;

    return (
      <Item.Group divided className={'bo-document-request-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

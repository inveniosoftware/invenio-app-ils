import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Item } from 'semantic-ui-react';
import LibraryListEntry from './LibraryListEntry';

export default class LibraryList extends Component {
  renderListEntry = library => {
    const metadata = library.metadata;
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(metadata);
    }
    return <LibraryListEntry key={metadata.pid} libraryMetadata={metadata} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length)
      return <Message data-test="no-results">There are no libraries.</Message>;

    return (
      <Item.Group divided className={'bo-document-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

LibraryList.propTypes = {
  hits: PropTypes.array.isRequired,
  renderListEntryElement: PropTypes.func,
};

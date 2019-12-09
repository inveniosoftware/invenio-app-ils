import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Item } from 'semantic-ui-react';
import VendorListEntry from './VendorListEntry';

export default class VendorList extends Component {
  renderListEntry = vendor => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(vendor);
    }
    return <VendorListEntry key={vendor.metadata.pid} vendor={vendor} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length)
      return <Message data-test="no-results">There are no vendors.</Message>;

    return (
      <Item.Group divided className={'bo-document-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

VendorList.propTypes = {
  hits: PropTypes.array.isRequired,
  renderListEntryElement: PropTypes.func,
};

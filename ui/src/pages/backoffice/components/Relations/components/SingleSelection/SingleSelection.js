import { RemoveItemButton } from '@pages/backoffice/components/buttons';
import { RelationCard } from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SingleSelection extends Component {
  render() {
    return (
      <RelationCard
        data={this.props.selections[0]}
        actions={
          <RemoveItemButton
            onClick={this.props.removeSelection}
            dataPid={this.props.selections[0].metadata.pid}
            popup={'Removes this selection'}
          />
        }
      />
    );
  }
}

SingleSelection.propTypes = {
  selections: PropTypes.array.isRequired,
};

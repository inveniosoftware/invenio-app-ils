import { recordToPidType } from '@api/utils';
import { RemoveItemButton } from '@pages/backoffice/components/buttons';
import { RelationCard } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

export default class SingleSelection extends Component {
  render() {
    let icon =
      recordToPidType(this.props.selections[0]) !== 'docid' ? (
        <Icon name="clone outline" size="huge" color="grey" />
      ) : (
        undefined
      );
    return (
      <RelationCard
        data={this.props.selections[0]}
        icon={icon}
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

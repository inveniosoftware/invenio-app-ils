import { DocumentLanguages } from '@components/Document';
import { RemoveItemButton } from '@pages/backoffice/components/buttons';
import { RelationListEntry } from '../RelationListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RelationCard } from '../RelationCard';
import isEmpty from 'lodash/isEmpty';
import { Container, Grid, Icon, Label, Message, Item } from 'semantic-ui-react';

export class MultipleSelections extends Component {
  render() {
    const { selections } = this.props;
    return (
      <Item.Group divided>
        {selections.map(selection => (
          <RelationListEntry
            document={selection}
            extra={
              <>
                <Icon size="big" name="language" />
                <Label className="ml-10">
                  <DocumentLanguages metadata={selection.metadata} />
                </Label>
              </>
            }
            actions={
              <RemoveItemButton
                onClick={this.props.removeFromSelection}
                dataPid={selection.metadata.pid}
                popup={'Removes this selection'}
              />
            }
          />
        ))}
      </Item.Group>
    );
  }
}

MultipleSelections.propTypes = {
  selections: PropTypes.array.isRequired,
  removeFromSelection: PropTypes.func.isRequired,
};

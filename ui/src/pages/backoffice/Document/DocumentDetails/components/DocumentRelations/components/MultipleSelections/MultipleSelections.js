import { DocumentLanguages } from '@components/Document';
import { RemoveItemButton } from '@pages/backoffice/components/buttons';
import { RelationListEntry } from '../RelationListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Label, Item } from 'semantic-ui-react';

export default class MultipleSelections extends Component {
  render() {
    const { selections } = this.props;
    return (
      <Item.Group divided>
        {selections.map(selection => (
          <RelationListEntry
            record={selection}
            key={selection.metadata.pid}
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
                onClick={this.props.removeSelection}
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
  removeSelection: PropTypes.func.isRequired,
};

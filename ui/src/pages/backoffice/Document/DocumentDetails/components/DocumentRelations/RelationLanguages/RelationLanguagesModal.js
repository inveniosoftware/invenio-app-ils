import { siblingRelationPayload } from '@api/utils';
import { DocumentLanguages } from '@components/Document';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import { DocumentSelectListEntry } from '@pages/backoffice/components/Document';
import { MultipleSelections } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/MultipleSelections';
import { RelationSummary } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/RelationSummary';
import { RelationCard, RelationModal, SelectedSiblings } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Icon, Label, Modal } from 'semantic-ui-react';
import { document as documentApi } from '@api';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';

export default class RelationLanguagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: [],
      isLoading: false,
    };
  }

  removeFromSelection = (e, { dataPid }) => {
    const { selections } = this.state;
    remove(selections, o => o.metadata.pid === dataPid);
    this.setState({ selections: selections });
  };

  onSelectResult = result => {
    const { id } = result;
    const { relations, relationType } = this.props;

    /* if relation already exists, nothing happens on select */
    if (
      isEmpty(relations.language) ||
      !relations.language.find(o => o.pid === result.metadata.pid)
    ) {
      result.id = id;
      result.key = id;
      result.disabled = false;
      const { selections } = this.state;
      selections.push(result);
      this.setState({ selections: selections });
    } else {
      result.id = id;
      result.key = id;
      result.disabled = true;
    }
  };

  selectResultRender = option => {
    const existingRelations = this.props.relations;
    const currentSelections = this.state.selections;

    const description = (
      <>
        <label>languages:</label>{' '}
        <DocumentLanguages metadata={option.metadata} />
      </>
    );
    let disabled = false;
    if (
      (!isEmpty(existingRelations.language) &&
        existingRelations.language.find(o => o.pid === option.metadata.pid)) ||
      currentSelections.find(o => o.pid === option.metadata.pid)
    ) {
      disabled = true;
    }
    return (
      <DocumentSelectListEntry
        document={option}
        description={description}
        disabled={disabled}
        key={option.metadata.pid}
      />
    );
  };

  render() {
    const { disabled, documentDetails } = this.props;
    return (
      <RelationModal
        disabled={disabled}
        triggerButtonContent={'Add languages'}
        modalHeader={
          <>
            Find related languages
            <Icon size="large" name="language" />
          </>
        }
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        selections={this.state.selections}
        refererRecord={documentDetails}
      >
        <Modal.Content>
          <Container textAlign="center">
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <HitsSearch
                    query={documentApi.list}
                    delay={250}
                    minCharacters={3}
                    placeholder={'Type to find a literature...'}
                    onSelect={this.onSelectResult}
                    resultRenderer={this.selectResultRender}
                    ref={element => (this.searchRef = element)}
                  />
                </Container>
              </Form.Group>
            </Form>
            <RelationSummary
              selections={this.state.selections}
              currentReferer={documentDetails}
              renderSelections={() => (
                <MultipleSelections
                  selections={this.state.selections}
                  removeFromSelection={this.removeFromSelection}
                />
              )}
              relationDescription={
                <>
                  <Icon name="arrows alternate horizontal" />
                  <br />
                  is a <Label color="blue">translation </Label> of
                </>
              }
            />
          </Container>
        </Modal.Content>
      </RelationModal>
    );
  }
}

RelationLanguagesModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

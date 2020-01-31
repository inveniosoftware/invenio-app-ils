import { document as documentApi } from '@api';
import { siblingRelationPayload } from '@api/utils';
import { DocumentLanguages } from '@components/Document';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import { DocumentSelectListEntry } from '@pages/backoffice/components/Document';
import { RelationSummary } from '../components/RelationSummary';
import { RelationCard, RelationModal } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Form,
  Icon,
  Input,
  Label,
  Modal,
} from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationOtherModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      note: undefined,
      isLoading: false,
    };
  }

  selectResultRender = option => {
    const existingRelations = this.props.relations;

    const description = (
      <>
        <label>languages:</label>{' '}
        <DocumentLanguages metadata={option.metadata} />
      </>
    );
    let disabled = false;
    if (
      !isEmpty(existingRelations.other) &&
      existingRelations.other.find(o => o.pid === option.metadata.pid)
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

  onSelectResult = result => {
    const { id } = result;
    const { relations } = this.props;

    if (
      isEmpty(relations.other) ||
      !relations.other.find(o => o.pid === result.metadata.pid)
    ) {
      result.id = id;
      result.key = id;
      this.setState({ selection: result });
    }
  };

  render() {
    const { disabled, documentDetails } = this.props;

    return (
      <RelationModal
        disabled={disabled}
        triggerButtonContent={'Add relation'}
        modalHeader={'Create new relation'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        selections={[this.state.selection]}
        refererRecord={documentDetails}
        extraRelationField={{ note: this.state.note }}
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
                    placeholder={'Type to find literature....'}
                    onSelect={this.onSelectResult}
                    resultRenderer={this.selectResultRender}
                    ref={element => (this.searchRef = element)}
                  />
                </Container>
              </Form.Group>
              You must provide a note for this relation
              <br /> <br />
              <Form.Field required inline key="note">
                <label>Note</label>
                <Input
                  name="note"
                  onChange={(e, { value }) => this.setState({ note: value })}
                />
              </Form.Field>
            </Form>
            <Divider />
            <RelationSummary
              selections={this.state.selection}
              currentReferer={documentDetails}
              renderSelections={() => (
                <RelationCard data={this.state.selection} />
              )}
              relationDescription={
                <>
                  <Icon name="arrows alternate horizontal" />
                  <br />
                  is (a) <Label color="blue">{this.state.note} </Label> of
                </>
              }
            />
          </Container>
        </Modal.Content>
      </RelationModal>
    );
  }
}

RelationOtherModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

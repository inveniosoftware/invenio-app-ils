import { DocumentEdition } from '@components/Document';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import { DocumentSelectListEntry } from '@pages/backoffice/components/Document';
import SeriesSelectListEntry from '@pages/backoffice/components/Series/SeriesSelectListEntry/SeriesSelectListEntry';
import { MultipleSelections } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/MultipleSelections';
import { RelationModal } from '../components';
import { RelationSummary } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/RelationSummary';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Icon, Label, Modal } from 'semantic-ui-react';
import { document as documentApi, series as seriesApi } from '@api';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';

export default class RelationEditionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: [],
      isLoading: false,
      currentRecordType: 'document',
      query: documentApi.list,
      selectOpen: false,
    };
  }

  removeFromSelection = (e, { dataPid }) => {
    const { selections } = this.state;
    remove(selections, o => o.metadata.pid === dataPid);

    this.setState({ selections: selections });
  };

  onSelectResult = result => {
    const { id } = result;
    const { relations } = this.props;
    const { selections } = this.state;

    /* if relation already exists, nothing happens on select */
    if (
      isEmpty(relations.edition) ||
      !relations.edition.find(o => o.pid === result.metadata.pid)
    ) {
      result.id = id;
      result.key = id;
      result.disabled = false;

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

    let disabled = false;
    if (
      (!isEmpty(existingRelations.edition) &&
        existingRelations.edition.find(o => o.pid === option.metadata.pid)) ||
      currentSelections.find(o => o.pid === option.metadata.pid)
    ) {
      disabled = true;
    }
    return this.state.currentRecordType === 'document' ? (
      <DocumentSelectListEntry
        document={option}
        description={option.metadata.document_type}
        disabled={disabled}
        key={option.metadata.pid}
      />
    ) : (
      <SeriesSelectListEntry
        series={option}
        description={
          <>
            {option.metadata.publisher} <DocumentEdition document={option} />
          </>
        }
        disabled={disabled}
      />
    );
  };

  toggleRecordTypeSearch = (e, { value }) => {
    if (value === 'document') {
      this.setState({
        currentRecordType: 'document',
        query: documentApi.list,
      });
    } else if (value === 'series') {
      this.setState({
        currentRecordType: 'series',
        query: seriesApi.list,
      });
    }
  };

  render() {
    const { disabled, documentDetails } = this.props;
    return (
      <RelationModal
        disabled={disabled}
        triggerButtonContent={'Add editions'}
        modalHeader={'Find related editions'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        selections={this.state.selections}
        refererRecord={documentDetails}
      >
        <Modal.Content>
          <Container textAlign="center">
            <Form>
              <Container className="spaced">
                <Form.Group inline>
                  <label>Search in</label>
                  <Form.Radio
                    label="Documents"
                    value="document"
                    checked={this.state.currentRecordType === 'document'}
                    onChange={this.toggleRecordTypeSearch}
                  />
                  <Form.Radio
                    label="Series"
                    value="series"
                    checked={this.state.currentRecordType === 'series'}
                    onChange={this.toggleRecordTypeSearch}
                  />
                </Form.Group>

                <Container className="spaced">
                  <HitsSearch
                    key={this.state.currentRecordType}
                    query={this.state.query}
                    delay={250}
                    minCharacters={3}
                    placeholder={'Type to find a literature...'}
                    onSelect={this.onSelectResult}
                    value={''}
                    resultRenderer={this.selectResultRender}
                    ref={element => (this.searchRef = element)}
                  />
                </Container>
              </Container>
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
                  is an <Label color="blue">edition </Label> of
                </>
              }
            />
          </Container>
        </Modal.Content>
      </RelationModal>
    );
  }
}

RelationEditionModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

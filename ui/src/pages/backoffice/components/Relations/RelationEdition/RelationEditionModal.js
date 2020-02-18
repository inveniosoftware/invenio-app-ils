import { DocumentEdition } from '@components/Document';
import { DocumentSelectListEntry } from '@pages/backoffice/components/Document';
import { SeriesSelectListEntry } from '@pages/backoffice/components/Series/SeriesSelectListEntry';
import {
  MultipleSelections,
  RelationSelector,
  RelationModal,
  RelationSummary,
} from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Form,
  Icon,
  Label,
  Modal,
} from 'semantic-ui-react';
import { document as documentApi, series as seriesApi } from '@api';

export default class RelationEditionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentRecordType: 'document',
      query: documentApi.list,
      selectOpen: false,
    };
  }

  selectResultRender = (option, disabled) => {
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
        key={option.metadata.pid}
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
        query: seriesApi.multipartMonographs,
      });
    }
  };

  render() {
    const { recordDetails } = this.props;
    return (
      <RelationModal
        triggerButtonContent={'Attach editions'}
        modalHeader={'Attach editions'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        referrerRecord={recordDetails}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select other editions of this document to create the relation.
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
                  <RelationSelector
                    relations={this.props.relations.edition}
                    optionsQuery={this.state.query}
                    currentRecordType={this.state.currentRecordType}
                    resultRenderer={this.selectResultRender}
                    referrerRecordPid={recordDetails.metadata.pid}
                  />
                </Container>
              </Container>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              currentReferrer={recordDetails}
              renderSelections={() => <MultipleSelections />}
              columnsWidths={{ left: 4, middle: 3, right: 9 }}
              relationDescription={
                <>
                  <Icon size="large" name="arrows alternate horizontal" />
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
  recordDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

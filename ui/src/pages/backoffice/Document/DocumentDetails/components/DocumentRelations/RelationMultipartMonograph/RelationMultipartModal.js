import SeriesSelectListEntry from '@pages/backoffice/components/Series/SeriesSelectListEntry/SeriesSelectListEntry';
import {
  RelationSelector,
  RelationModal,
  RelationSummary,
  SingleSelection,
} from '@pages/backoffice/components/Relations';
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
import { series as seriesApi } from '@api';

export default class RelationMultipartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      volume: undefined,
      isLoading: false,
    };
  }

  selectResultRender = (option, disabled) => {
    return (
      <SeriesSelectListEntry
        series={option}
        description={option.metadata.publisher}
        disabled={disabled}
      />
    );
  };

  render() {
    const { disabled, documentDetails } = this.props;
    return (
      <RelationModal
        disabled={disabled}
        modalHeader={'Attach document to a multipart monograph'}
        triggerButtonContent={'Attach multipart'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        referrerRecord={documentDetails}
        extraRelationField={{ field: { volume: this.state.volume } }}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select a multipart monograph to attach this document to it.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    mode={'single'}
                    existingRelations={this.props.relations.multipart_monograph}
                    optionsQuery={seriesApi.multipartMonographs}
                    resultRenderer={this.selectResultRender}
                    referrerRecordPid={documentDetails.metadata.pid}
                  />
                </Container>
              </Form.Group>
              Provide volume index (optional)
              <br />
              <br />
              <Form.Field inline key="volume">
                <label>Volume index</label>
                <Input
                  name="volume"
                  type="number"
                  onChange={(e, { value }) => this.setState({ volume: value })}
                />
              </Form.Field>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              currentReferrer={documentDetails}
              renderSelections={() => <SingleSelection />}
              relationDescription={
                <>
                  <Icon size="large" name="arrow right" />
                  <br />
                  is{' '}
                  <Label color="blue">
                    volume{' '}
                    {this.state.volume && (
                      <Label.Detail>{this.state.volume}</Label.Detail>
                    )}{' '}
                  </Label>{' '}
                  of
                </>
              }
            />
          </Container>
        </Modal.Content>
      </RelationModal>
    );
  }
}

RelationMultipartModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

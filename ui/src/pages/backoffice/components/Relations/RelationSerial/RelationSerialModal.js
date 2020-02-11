import { SeriesAuthors } from '@components';
import { SeriesSelectListEntry } from '@pages/backoffice/components/Series';
import {
  RelationModal,
  SingleSelection,
  RelationSummary,
  RelationSelector,
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

export default class RelationSerialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: undefined,
      isLoading: false,
    };
  }

  selectResultRender = (option, disabled) => {
    return (
      <SeriesSelectListEntry
        series={option}
        description={
          <>
            <SeriesAuthors metadata={option.metadata} />
            {<label>By </label> && option.metadata.publisher} <br />
          </>
        }
        disabled={disabled}
      />
    );
  };

  render() {
    const { disabled, recordDetails } = this.props;
    return (
      <RelationModal
        disabled={disabled}
        modalHeader={'Attach document to a serial'}
        triggerButtonContent={'Add to a serial'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        refererRecord={recordDetails}
        extraRelationField={{ volume: this.state.volume }}
      >
        <Modal.Content>
          <Container textAlign="left">
            Fill the fields to attach this document to a serial.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    mode={'single'}
                    relations={this.props.relations.serial || {}}
                    optionsQuery={seriesApi.serials}
                    resultRenderer={this.selectResultRender}
                    refererRecordPid={recordDetails.metadata.pid}
                    relationType={this.props.relationType}
                  />
                </Container>
              </Form.Group>
              Provide volume index (optional)
              <br /> <br />
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
              currentReferer={recordDetails}
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

RelationSerialModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  recordDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

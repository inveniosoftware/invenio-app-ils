import { series as seriesApi } from '@api';
import { SeriesLanguages } from '@components/Series';
import {
  RelationModal,
  RelationSelector,
  RelationSummary,
  SingleSelection,
} from '@pages/backoffice/components/Relations';
import SeriesSelectListEntry from '@pages/backoffice/components/Series/SeriesSelectListEntry/SeriesSelectListEntry';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Container,
  Divider,
  Form,
  Icon,
  Input,
  Label,
  Modal,
} from 'semantic-ui-react';

export default class RelationOtherModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: undefined,
      isLoading: false,
    };
  }

  selectResultRender = (option, disabled) => {
    const description = (
      <>
        <label>languages:</label> <SeriesLanguages metadata={option.metadata} />
      </>
    );
    return (
      <SeriesSelectListEntry
        series={option}
        description={description}
        disabled={disabled}
        key={option.metadata.pid}
      />
    );
  };

  render() {
    const { disabled, seriesDetails } = this.props;
    const fetchOptionsQuery =
      seriesDetails.metadata.mode_of_issuance === 'SERIAL'
        ? seriesApi.serials
        : seriesApi.multipartMonographs;
    return (
      <RelationModal
        disabled={disabled}
        triggerButtonContent={'Add relation'}
        modalHeader={'Create new relation'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        referrerRecord={seriesDetails}
        extraRelationField={{
          field: {
            note: this.state.note,
          },
          options: {
            isValid: !_isEmpty(this.state.note),
          },
        }}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select a series to create a new relation.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    existingRelations={this.props.relations.other}
                    mode={'single'}
                    optionsQuery={fetchOptionsQuery}
                    resultRenderer={this.selectResultRender}
                    referrerRecordPid={seriesDetails.metadata.pid}
                  />
                </Container>
              </Form.Group>
              Note describing the relation
              <br /> <br />
              <Form.Field required inline key="note">
                <label>Note</label>
                <Input
                  name="note"
                  onChange={(e, { value }) => this.setState({ note: value })}
                />
              </Form.Field>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              currentReferrer={seriesDetails}
              renderSelections={() => <SingleSelection />}
              relationDescription={
                <>
                  <Icon name="arrows alternate horizontal" />
                  <br />
                  is (a) <Label color="blue">
                    {this.state.note || '...'}{' '}
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

RelationOtherModal.propTypes = {
  /* relations got from the current series, reducer */
  relations: PropTypes.object.isRequired,
  seriesDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

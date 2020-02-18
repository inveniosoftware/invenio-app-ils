import { SeriesLanguages } from '@components/Series';
import {
  RelationModal,
  RelationSummary,
  SingleSelection,
  RelationSelector,
} from '@pages/backoffice/components/Relations';
import SeriesSelectListEntry from '@pages/backoffice/components/Series/SeriesSelectListEntry/SeriesSelectListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Form,
  Icon,
  Label,
  Modal,
  Popup,
} from 'semantic-ui-react';
import { series as seriesApi } from '@api';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';

export default class RelationOtherModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'next',
      label: 'is continued by',
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
    const { disabled, seriesDetails, relations } = this.props;

    const existingNext = relations['next'] || [];
    const existingPrevious = relations['previous'] || [];
    const existingRelations = concat(existingNext, existingPrevious);

    return (
      <RelationModal
        disabled={disabled}
        triggerButtonContent={'Add sequence relation'}
        modalHeader={'Create new sequence relation'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        referrerRecord={seriesDetails}
        extraRelationField={{ type: this.state.type, required: true }}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select a series below to create a sequence.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    relations={existingRelations}
                    mode={'single'}
                    optionsQuery={seriesApi.serials}
                    resultRenderer={this.selectResultRender}
                    referrerRecordPid={seriesDetails.metadata.pid}
                    relatioonType={this.props.relationType}
                  />
                </Container>
              </Form.Group>
              <br /> <br />
              <Form.Group inline>
                <label>Choose the sequence direction</label>
                <Form.Radio
                  label="is continued by"
                  value="next"
                  checked={this.state.type === 'next'}
                  onChange={(e, { value }) =>
                    this.setState({ type: value, label: 'is continued by' })
                  }
                />
                <Form.Radio
                  label="continues"
                  value="previous"
                  checked={this.state.type === 'previous'}
                  disabled={!isEmpty(existingPrevious)}
                  onChange={(e, { value }) =>
                    this.setState({ type: value, label: 'continues' })
                  }
                />
                {!isEmpty(existingPrevious) && (
                  <Popup
                    content={
                      'There is already existing predecessor. Only one can be added.'
                    }
                    trigger={
                      <Icon
                        name="question circle"
                        className="bo-form-inline-icon"
                      />
                    }
                  />
                )}
              </Form.Group>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              currentReferrer={seriesDetails}
              renderSelections={() => <SingleSelection />}
              relationDescription={
                <>
                  {this.state.type === 'next' ? (
                    <Icon name="arrow right" />
                  ) : (
                    <Icon name="arrow left" />
                  )}
                  <br />{' '}
                  <Label color="blue">{this.state.label || '...'} </Label>
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

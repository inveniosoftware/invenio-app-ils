import { SeriesLanguages } from '@components/Series';
import {
  RelationModal,
  RelationSummary,
  RelationSelector,
  MultipleSelections,
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
} from 'semantic-ui-react';
import { series as seriesApi } from '@api';

export default class RelationLanguagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { seriesDetails } = this.props;

    const fetchOptionsQuery =
      seriesDetails.metadata.mode_of_issuance === 'SERIAL'
        ? seriesApi.serials
        : seriesApi.multipartMonographs;
    return (
      <RelationModal
        triggerButtonContent={'Add language relations'}
        modalHeader={
          <>
            Attach translations <Icon size="large" name="language" />
          </>
        }
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        refererRecord={seriesDetails}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select translations to create the relation.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    relations={this.props.relations.language}
                    optionsQuery={fetchOptionsQuery}
                    resultRenderer={this.selectResultRender}
                    refererRecordPid={seriesDetails.metadata.pid}
                  />
                </Container>
              </Form.Group>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              columnsWidths={{ left: 4, middle: 3, right: 9 }}
              currentReferer={seriesDetails}
              renderSelections={() => <MultipleSelections />}
              relationDescription={
                <>
                  <Icon size="large" name="arrows alternate horizontal" />
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
  /* relations got from the current series, reducer */
  relations: PropTypes.object.isRequired,
  seriesDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

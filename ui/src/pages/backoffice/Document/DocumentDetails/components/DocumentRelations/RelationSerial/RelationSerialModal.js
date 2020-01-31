import { parentChildRelationPayload } from '@api/utils';
import { SeriesAuthors } from '@components';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import { SeriesSelectListEntry } from '@pages/backoffice/components/Series';
import { RelationSummary } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/RelationSummary';
import { RelationCard, RelationModal, SelectedParent } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Form,
  Icon,
  Input,
  Label,
  Modal,
} from 'semantic-ui-react';
import { series as seriesApi } from '@api';
import isEmpty from 'lodash/isEmpty';

export default class RelationSerialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      volume: undefined,
      isLoading: false,
    };
  }

  selectResultRender = option => {
    const { relations } = this.props;
    let disabled = false;
    if (
      !isEmpty(relations.serial) &&
      relations.serial.find(o => o.pid === option.metadata.pid)
    ) {
      disabled = true;
    }
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

  onSelectResult = result => {
    const { id } = result;
    const { relations } = this.props;

    if (
      isEmpty(relations.serial) ||
      !relations.serial.find(o => o.pid === result.metadata.pid)
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
        triggerButtonContent={'Add to a serial'}
        modalHeader={'Attach document to a serial'}
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        selections={[this.state.selection]}
        refererRecord={documentDetails}
        extraRelationField={{ volume: this.state.volume }}
      >
        <Modal.Content>
          <Container textAlign="center">
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <HitsSearch
                    query={seriesApi.serials}
                    delay={250}
                    minCharacters={3}
                    placeholder={'Type to find a serial'}
                    onSelect={this.onSelectResult}
                    resultRenderer={this.selectResultRender}
                    ref={element => (this.searchRef = element)}
                  />
                </Container>
              </Form.Group>
              You can provide volume index for the document in selected serial
              (optional)
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
            <RelationSummary
              selections={this.state.selection}
              currentReferer={documentDetails}
              renderSelections={() => (
                <RelationCard
                  data={this.state.selection}
                  icon={<Icon name="clone outline" size="huge" color="grey" />}
                />
              )}
              relationDescription={
                <>
                  <Icon name="arrow right" />
                  <br />
                  is{' '}
                  <Label color="blue">
                    volume <Label.Detail>{this.state.volume}</Label.Detail>{' '}
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
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};

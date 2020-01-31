import { parentChildRelationPayload } from '@api/utils';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import SeriesSelectListEntry from '@pages/backoffice/components/Series/SeriesSelectListEntry/SeriesSelectListEntry';
import { RelationSummary } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/RelationSummary';
import { RelationCard, RelationModal } from '../components';
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

export default class RelationMultipartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      visible: false,
      volume: undefined,
      isLoading: false,
    };
  }

  selectResultRender = option => {
    const { relations } = this.props;
    let disabled = false;
    if (
      !isEmpty(!relations.multipart_monograph) &&
      relations.multipart_monograph.find(o => o.pid === option.metadata.pid)
    ) {
      disabled = true;
    }
    return (
      <SeriesSelectListEntry
        series={option}
        description={option.metadata.publisher}
        disabled={disabled}
      />
    );
  };

  onSelectResult = result => {
    const { id } = result;
    const { relations } = this.props;

    if (
      isEmpty(relations.multipart_monograph) ||
      !relations.multipart_monograph.find(o => o.pid === result.metadata.pid)
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
        triggerButtonContent={'Add to a multipart'}
        modalHeader={'Attach document to a multipart monograph'}
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
                    query={seriesApi.multipartMonographs}
                    delay={250}
                    minCharacters={3}
                    placeholder={'Type to find multipart monograph'}
                    resultRenderer={this.selectResultRender}
                    onSelect={this.onSelectResult}
                    ref={element => (this.searchRef = element)}
                  />
                </Container>
              </Form.Group>
              You can provide volume index for the document in selected
              multipart (optional)
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

RelationMultipartModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

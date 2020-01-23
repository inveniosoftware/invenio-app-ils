import { parentChildRelationPayload } from '@api/utils';
import { HitsSearch } from '@components/ESSelector/HitsSearch';
import { SelectedSeries } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/SelectedSeries';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Icon, Input, Modal } from 'semantic-ui-react';
import { series as seriesApi } from '@api';
import isEmpty from 'lodash/isEmpty';

export default class RelationSerialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      visible: false,
      volume: undefined,
      isLoading: false,
    };
  }

  toggle = () => this.setState({ visible: !this.state.visible });

  onSave = () => {
    this.setState({ isLoading: true });
    const { selection, volume } = this.state;

    const newRelation = parentChildRelationPayload(
      this.props.relationType,
      { volume: volume },
      selection,
      this.props.documentDetails
    );

    const pid = this.props.documentDetails.pid;
    this.props.createRelations(pid, [newRelation]);
    this.setState({ isLoading: false });
    this.toggle();
  };

  /* see HitsSearch.js -> ResultRenderer */
  serializeSeries = series => {
    const { relations } = this.props;
    if (
      !isEmpty(relations.serial) &&
      relations.serial.find(o => o.pid === series.metadata.pid)
    ) {
      return {};
    }
    return {
      id: series.metadata.pid,
      key: series.metadata.pid,
      title: series.metadata.title,
      description: series.metadata.mode_of_issuance,
      extra: `Series #${series.metadata.pid}`,
      metadata: series.metadata,
    };
  };

  onSelectResult = result => {
    const { id } = result;
    const { recordType, relationType } = this.props;
    const relatedId = `${id}-${recordType}-${relationType}`;

    result.id = relatedId;
    result.key = relatedId;
    this.setState({ selection: result });
  };

  render() {
    const { disabled, documentDetails } = this.props;
    let filteredSerials = seriesApi.partialSerials(this.props.relations.serial);
    return (
      <Modal
        id="es-selector-modal"
        trigger={
          <Button
            disabled={disabled}
            className="edit-related"
            icon
            labelPosition="left"
            positive
            onClick={this.toggle}
          >
            <Icon name="add" />
            Add to a serial
          </Button>
        }
        open={this.state.visible}
        centered={true}
        onClose={this.toggle}
      >
        <Modal.Header>Attach document to a serial.</Modal.Header>
        <Modal.Content>
          <Container textAlign="center">
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <HitsSearch
                    query={filteredSerials}
                    delay={250}
                    minCharacters={3}
                    placeholder={'Type to find a serial'}
                    serializer={this.serializeSeries}
                    onSelect={this.onSelectResult}
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
            <SelectedSeries
              selection={this.state.selection}
              currentDocument={documentDetails}
              volume={this.state.volume}
            />
          </Container>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.toggle()}>Cancel action</Button>
          <Button
            positive
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            icon="checkmark"
            labelPosition="right"
            content="Confirm and save"
            onClick={this.onSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

RelationSerialModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

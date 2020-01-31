import { parentChildRelationPayload, siblingRelationPayload } from '@api/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';

export default class RelationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggle = () => this.setState({ visible: !this.state.visible });

  onSave = () => {
    const {
      relationType,
      selections,
      extraRelationField,
      refererRecord,
    } = this.props;

    this.setState({ isLoading: true });
    let newRelations = [];

    if (relationType === 'serial' || relationType === 'multipart_monograph') {
      const payload = parentChildRelationPayload(
        this.props.relationType,
        extraRelationField,
        selections[0],
        refererRecord
      );
      newRelations.push(payload);
    } else {
      selections.map(selection =>
        newRelations.push(
          siblingRelationPayload(relationType, extraRelationField, selection)
        )
      );
    }

    const pid = refererRecord.pid;
    this.props.createRelations(pid, newRelations);
    this.setState({ isLoading: false });
    this.toggle();
  };

  render() {
    const {
      disabled,
      triggerButtonContent,
      modalHeader,
      isLoading,
    } = this.props;

    return (
      <Modal
        id="es-selector-modal"
        size="large"
        closeIcon
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
            {triggerButtonContent}
          </Button>
        }
        open={this.state.visible}
        centered={true}
        onClose={this.toggle}
      >
        <Modal.Header>{modalHeader}</Modal.Header>

        {this.props.children}

        <Modal.Actions>
          <Button onClick={() => this.toggle()}>Cancel action</Button>
          <Button
            positive
            loading={isLoading}
            disabled={isLoading}
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

RelationModal.propTypes = {
  disabled: PropTypes.bool.isRequired,
  triggerButtonContent: PropTypes.string.isRequired,
  modalHeader: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refererRecord: PropTypes.object.isRequired,
  extraRelationField: PropTypes.object.isRequired,

  selections: PropTypes.array,
};

RelationModal.defaultProps = {
  extraRelationField: {},
};

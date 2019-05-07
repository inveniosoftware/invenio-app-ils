import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';
import { ESSelector } from './';
import './ESSelector.scss';

export default class ESSelectorModal extends Component {
  state = { visible: false };

  constructor(props) {
    super(props);
    this.selectorRef = null;
  }

  toggle = () => this.setState({ visible: !this.state.visible });

  save = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.props.selections);
    }
    this.toggle();
  };

  render() {
    const { title } = this.props;
    const trigger = React.cloneElement(this.props.trigger, {
      onClick: this.toggle,
    });

    return (
      <Modal
        id="es-selector-modal"
        open={this.state.visible}
        trigger={trigger}
        size="tiny"
        centered={false}
        onClose={this.toggle}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <ESSelector {...this.props} />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={this.toggle}>
            Close
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Save"
            onClick={this.save}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

ESSelectorModal.propTypes = {
  alwaysWildcard: PropTypes.bool,
  multiple: PropTypes.bool,
  trigger: PropTypes.node.isRequired,
  title: PropTypes.string,
  initialSelections: PropTypes.array,
};

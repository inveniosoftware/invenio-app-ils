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
    const { title, content, selectorComponent, size } = this.props;
    const trigger = React.cloneElement(this.props.trigger, {
      onClick: this.toggle,
    });
    const Selector = selectorComponent ? selectorComponent : ESSelector;

    return (
      <Modal
        id="es-selector-modal"
        open={this.state.visible}
        trigger={trigger}
        size={size}
        centered={false}
        onClose={this.toggle}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <p>{content}</p>
          <Selector {...this.props} />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={this.toggle}>
            Close
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content={
              this.props.saveButtonContent
                ? this.props.saveButtonContent
                : 'Save'
            }
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
  size: PropTypes.string,
  initialSelections: PropTypes.array,
  onSelectResult: PropTypes.func,
  onRemoveSelection: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
};

ESSelectorModal.defaultProps = {
  size: 'tiny',
};

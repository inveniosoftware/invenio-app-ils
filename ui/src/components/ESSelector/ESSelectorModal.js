import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';
import { ESSelector } from './';

export default class ESSelectorModal extends Component {
  state = {
    selections: [],
    visible: false,
  };

  constructor(props) {
    super(props);
    this.selectorRef = null;
  }

  onSelectionsUpdate = selections => this.setState({ selections });

  toggle = () => this.setState({ visible: !this.state.visible });

  save = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.state.selections);
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
          <Selector
            onSelectionsUpdate={this.onSelectionsUpdate}
            {...this.props}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={this.toggle}>
            Close
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="left"
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
  onSave: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
};

ESSelectorModal.defaultProps = {
  size: 'tiny',
};

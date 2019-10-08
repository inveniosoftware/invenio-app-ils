import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Header,
  Icon,
  Input,
  Modal,
  Popup,
  Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class CancelModal extends Component {
  state = {
    open: false,
    showPopup: false,
    value: this.props.value,
  };

  hide = () => this.setState({ open: false, showPopup: false, value: '' });
  show = () => this.setState({ open: true, showPopup: false, value: '' });

  updateInputRef = element => {
    this.inputRef = element
      ? ReactDOM.findDOMNode(element).querySelector('input')
      : null;
  };

  cancel = () => {
    const { value } = this.state;
    if (isEmpty(value)) {
      this.setState({ showPopup: true });
    } else {
      this.props.action(value);
      this.hide();
    }
  };

  handleOnChange = (event, { value }) => {
    const newState = { value };
    if (this.state.showPopup && !isEmpty(value)) {
      newState.showPopup = false;
    }
    this.setState(newState);
  };

  render() {
    const { buttonText, cancelText, content, header } = this.props;
    return (
      <Modal
        basic
        size="small"
        trigger={<Button primary content={buttonText} onClick={this.show} />}
        open={this.state.open}
        onClose={this.hide}
      >
        <Header content={header} />
        <Modal.Content>
          <p>{content}</p>
          <Form onSubmit={this.cancel}>
            <Input
              focus
              fluid
              placeholder="Enter a reason..."
              onChange={this.handleOnChange}
              ref={this.updateInputRef}
              value={this.state.value}
            />
          </Form>
          <Popup
            context={this.inputRef}
            content="Please specify a reason."
            position="bottom left"
            open={this.state.showPopup}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="black" inverted onClick={this.hide}>
            Back
          </Button>
          <Button color="red" inverted onClick={this.cancel}>
            <Icon name="remove" /> {cancelText}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

CancelModal.propTypes = {
  action: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  value: PropTypes.string,
};

CancelModal.defaultProps = {
  value: '',
};

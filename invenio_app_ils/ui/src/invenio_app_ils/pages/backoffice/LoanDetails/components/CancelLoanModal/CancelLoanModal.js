import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Header, Icon, Input, Modal, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class CancelLoanModal extends Component {
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
    const { loan } = this.props;
    return (
      <Modal
        basic
        size="small"
        trigger={<Button primary content="cancel" onClick={this.show} />}
        open={this.state.open}
        onClose={this.hide}
      >
        <Header content={`Cancel Loan #${loan.loan_pid}`} />
        <Modal.Content>
          <p>
            You are about to cancel loan #{loan.loan_pid}. Please enter a reason
            for cancelling this loan.
          </p>
          <Input
            focus
            fluid
            placeholder="Enter a cancel reason..."
            onChange={this.handleOnChange}
            ref={this.updateInputRef}
            value={this.state.value}
          />
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
            <Icon name="remove" /> Cancel Loan
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

CancelLoanModal.propTypes = {
  action: PropTypes.func.isRequired,
  loan: PropTypes.object.isRequired,
  value: PropTypes.string,
};

CancelLoanModal.defaultProps = {
  value: '',
};

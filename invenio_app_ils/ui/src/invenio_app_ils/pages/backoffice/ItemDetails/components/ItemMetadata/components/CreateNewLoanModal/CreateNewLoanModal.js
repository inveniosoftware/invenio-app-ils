import React, { Component } from 'react';
import { generatePath } from 'react-router';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Loader } from '../../../../../../../common/components/Loader';
import { BackOfficeURLS } from '../../../../../../../common/urls';
import history from '../../../../../../../history';
import _isEmpty from 'lodash/isEmpty';

export default class CreateNewLoanModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.createNewLoanForItem = this.props.createNewLoanForItem.bind(this);
    this.onLoanCreatedCallback = this.props.onLoanCreatedCallback.bind(this);
  }

  componentDidMount() {
    this.props.resetNewLoanState();
  }

  close = () => {
    this.setState({ open: false }, () => {
      this.props.onLoanCreatedCallback(this.props.itemPid);
    });
  };

  checkoutNewLoan = (itemPid, loan) => {
    this.createNewLoanForItem(itemPid, loan);
  };

  triggerButton = (
    <Button
      positive
      floated="right"
      size="small"
      onClick={() => this.setState({ open: true })}
      disabled={!this.props.active}
    >
      <Icon name="add" />
      Create new loan
    </Button>
  );

  gotoDetailsPage = loanPid => {
    const path = generatePath(BackOfficeURLS.loanDetails, {
      loanPid: loanPid,
    });
    history.push(path);
  };

  render() {
    let { itemPid, isLoading, data, hasError } = this.props;
    let loanData = {
      item_pid: itemPid,
      patron_pid: '111', // FIXME: change this to be able to search for the user
    };
    let showInitialView = !isLoading && !hasError && _isEmpty(data);
    let showSuccessView = !isLoading && !hasError && !_isEmpty(data);

    return (
      <Modal trigger={this.triggerButton} size="small" open={this.state.open}>
        <Header content="Create new loan" />
        <Loader isLoading={isLoading}>
          <Modal.Content>
            {showInitialView && (
              <p>You are about to create a new loan for item {itemPid}</p>
            )}
            {showSuccessView && <p>Your loan created successfully.</p>}
          </Modal.Content>
        </Loader>
        <Modal.Actions>
          {showInitialView && (
            <div>
              <Button color="red" onClick={() => this.close()}>
                <Icon name="remove" /> Cancel
              </Button>
              <Button
                color="green"
                onClick={() => this.checkoutNewLoan(itemPid, loanData)}
              >
                <Icon name="checkmark" /> Checkout
              </Button>
            </div>
          )}
          {showSuccessView && (
            <div>
              <Button color="red" onClick={() => this.close()}>
                <Icon name="remove" /> Close
              </Button>
              <Button primary onClick={() => this.gotoDetailsPage(data.id)}>
                View loan
              </Button>
            </div>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

CreateNewLoanModal.propTypes = {
  itemPid: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

CreateNewLoanModal.defaultPropTypes = {
  active: true,
};

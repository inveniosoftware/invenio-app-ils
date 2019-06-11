import React, { Component } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Loader } from '../../../../../../../common/components/Loader';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import isEmpty from 'lodash/isEmpty';

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
      icon
      labelPosition="left"
      size="small"
      onClick={() => this.setState({ open: true })}
      disabled={!this.props.active}
    >
      <Icon name="add" />
      Checkout this item
    </Button>
  );

  gotoDetailsPage = loanPid => goTo(BackOfficeRoutes.loanDetailsFor(loanPid));

  render() {
    const { itemPid, itemBarcode, isLoading, data, hasError } = this.props;
    const loanData = {
      item_pid: itemPid,
      patron_pid: '111', // FIXME: change this to be able to search for the user
    };
    const showInitialView = !isLoading && !hasError && isEmpty(data);
    const showSuccessView = !isLoading && !hasError && !isEmpty(data);

    return (
      <Modal
        trigger={this.triggerButton}
        size="small"
        open={this.state.open}
        basic
      >
        <Header content={`Checkout item ${itemBarcode}`} />
        <Loader isLoading={isLoading}>
          <Modal.Content>
            {showInitialView && (
              <p>
                You are about to checkout the item with barcode {itemBarcode}{' '}
                and create a new loan for the patron ID.
              </p>
            )}
            {showSuccessView && <p>Loan created successfully.</p>}
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
  itemBarcode: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

CreateNewLoanModal.defaultPropTypes = {
  active: true,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../../common/components';
import { Button, Modal, Header, Icon } from 'semantic-ui-react';
import { ResultsTableFormatter as formatter } from '../../../../../../../common/components';
import { invenioConfig, ES_DELAY } from '../../../../../../../common/config';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
  }

  state = { isModalOpen: false };

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  onClickCheckoutHandler = (item, patron, shouldForceCheckout) =>
    this.checkoutItem(item, patron, shouldForceCheckout).then(() => {
      this.clearResults();
      setTimeout(() => {
        this.fetchPatronCurrentLoans(patron);
      }, ES_DELAY);
    });

  actions(item, itemState) {
    const buttonCheckout = (
      <Button
        content={'Checkout'}
        onClick={() =>
          this.onClickCheckoutHandler(item, this.props.patron, false)
        }
      />
    );

    const circulationStatus = !isEmpty(item.circulation_status)
      ? item.circulation_status
      : null;

    return !invenioConfig.circulation.loanActiveStates.includes(
      circulationStatus
    ) && invenioConfig.items.available.status.includes(itemState)
      ? buttonCheckout
      : this.renderForceCheckoutModal(item);
  }

  renderForceCheckoutModal = item => {
    const { isModalOpen } = this.state;

    return (
      <Modal
        trigger={
          <Button color="yellow" onClick={this.toggleModal}>
            Force Checkout
          </Button>
        }
        open={isModalOpen}
        onClose={this.toggleModal}
        closeIcon
      >
        <Header
          icon="exclamation triangle"
          content="Force Checkout of Missing Item"
        />
        <Modal.Content>
          <p>
            You are creating a loan for a missing item, would you like to
            continue?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.toggleModal}>
            <Icon name="remove" /> No
          </Button>
          <Button
            color="green"
            onClick={() =>
              this.onClickCheckoutHandler(item, this.props.patron, true)
            }
          >
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.item.toTable(row);
      serialized['Actions'] = this.actions(row, row.metadata.status);
      return pick(serialized, [
        'ID',
        'Status',
        'Medium',
        'Circulation status',
        'Actions',
      ]);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    return rows.length ? (
      <ResultsTable
        rows={rows}
        name={'items'}
        actionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.object.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patron: PropTypes.number.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
};

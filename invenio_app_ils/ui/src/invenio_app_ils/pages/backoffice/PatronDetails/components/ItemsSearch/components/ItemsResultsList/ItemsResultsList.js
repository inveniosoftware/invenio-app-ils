import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../../common/components';
import { Button, Modal, Header, Icon } from 'semantic-ui-react';
import { invenioConfig, ES_DELAY } from '../../../../../../../common/config';
import isEmpty from 'lodash/isEmpty';

export class ItemsResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
  }

  state = { isModalOpen: false };

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  onClickCheckoutHandler = async (
    documentPid,
    itemPid,
    patronPid,
    force = false
  ) => {
    await this.checkoutItem(documentPid, itemPid, patronPid, force);
    this.clearResults();
    setTimeout(() => {
      this.fetchPatronCurrentLoans(patronPid);
    }, ES_DELAY);
  };

  actions = ({ row }) => {
    // NOTE: will remove these after review
    // itemState = row.metadata.status
    // row is the item
    const { patronPid } = this.props;
    const buttonCheckout = (
      <Button
        content={'Checkout'}
        onClick={() => {
          this.onClickCheckoutHandler(
            row.metadata.document_pid,
            row.metadata.pid,
            patronPid,
            false
          );
        }}
      />
    );

    const circulationStatus = !isEmpty(row.metadata.circulation)
      ? row.metadata.circulation.state
      : null;

    return !invenioConfig.circulation.loanActiveStates.includes(
      circulationStatus
    ) && invenioConfig.items.canCirculateStates.includes(row.metadata.status)
      ? buttonCheckout
      : this.renderForceCheckoutModal(row);
  };

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
              this.onClickCheckoutHandler(item, this.props.patronPid, true)
            }
          >
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  render() {
    const { results } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Status', field: 'metadata.status' },
      { title: 'Medium', field: 'metadata.medium' },
      { title: 'Circulation status', field: 'metadata.circulation.state' },
      {
        title: 'Actions',
        field: '',
        formatter: this.actions,
      },
    ];

    return results.hits.length ? (
      <ResultsTable
        data={results.hits}
        columns={columns}
        totalHitsCount={results.length}
        name={'items'}
      />
    ) : null;
  }
}

ItemsResultsList.propTypes = {
  results: PropTypes.object.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patronPid: PropTypes.string.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
};

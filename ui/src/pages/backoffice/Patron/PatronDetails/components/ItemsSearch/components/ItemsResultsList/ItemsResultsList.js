import { recordToPidType } from '@api/utils';
import { Loader, ResultsTable } from '@components';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Modal, Segment } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

export default class ItemsResultsList extends Component {
  constructor(props) {
    super(props);
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
  }

  state = { isModalOpen: false };

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  onClickCheckoutHandler = async (
    documentPid,
    itemPid,
    patronPid,
    force = false
  ) => {
    this.checkoutItem(documentPid, itemPid, patronPid, force);
  };

  actions = ({ row }) => {
    const { patronPid } = this.props;
    const buttonCheckout = (
      <Button
        content={'Checkout'}
        onClick={() => {
          const itemPid = {
            type: recordToPidType(row),
            value: row.metadata.pid,
          };
          this.onClickCheckoutHandler(
            row.metadata.document_pid,
            itemPid,
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
    ) && invenioConfig.items.canCirculateStatuses.includes(row.metadata.status)
      ? buttonCheckout
      : this.renderForceCheckoutModal(row);
  };

  renderForceCheckoutModal = item => {
    const { isModalOpen } = this.state;
    const itemPid = {
      type: recordToPidType(item),
      value: item.metadata.pid,
    };
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
              this.onClickCheckoutHandler(
                item.metadata.document_pid,
                itemPid,
                this.props.patronPid,
                true
              )
            }
          >
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Link
        to={BackOfficeRoutes.itemDetailsFor(row.metadata.pid)}
        data-test={row.metadata.pid}
      >
        {row.metadata.barcode}
      </Link>
    );
  };

  render() {
    const { results, checkoutIsLoading } = this.props;
    const columns = [
      {
        title: 'Barcode',
        field: 'metadata.barcode',
        formatter: this.viewDetails,
      },
      { title: 'Status', field: 'metadata.status' },
      { title: 'Medium', field: 'metadata.medium' },
      { title: 'Circulation status', field: 'metadata.circulation.state' },
      {
        title: 'Actions',
        field: '',
        formatter: this.actions,
      },
    ];

    return !_isEmpty(results.hits) ? (
      <Loader isLoading={checkoutIsLoading}>
        <p>Found {results.hits.length} item(s).</p>
        <ResultsTable
          data={results.hits}
          columns={columns}
          totalHitsCount={results.length}
          name={'items'}
        />
      </Loader>
    ) : (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Found no items matching this barcode.
        </Header>
        <p>
          HINT: Check if the physical copy is not already on loan by someone
          else.
        </p>
        <Segment.Inline>
          <Button primary onClick={() => this.props.clearSearchQuery()}>
            Clear search phrase
          </Button>
        </Segment.Inline>
      </Segment>
    );
  }
}

ItemsResultsList.propTypes = {
  results: PropTypes.object.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patronPid: PropTypes.string.isRequired,
};

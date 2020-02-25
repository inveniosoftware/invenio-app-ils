import { invenioConfig } from '@config';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { ItemMetadata } from '../ItemMetadata';
import { LoanActions } from '../LoanActions';
import { AvailableItems } from '../AvailableItems';
import {
  OverdueLoanSendMailModal,
  MetadataTable,
} from '@pages/backoffice/components';
import isEmpty from 'lodash/isEmpty';
import { toShortDateTime } from '@api/date';
import { LoanLinkToItem } from '../../../../components/Loan';

export default class LoanMetadata extends Component {
  constructor(props) {
    super(props);
    const isRequest = invenioConfig.circulation.loanRequestStates.includes(
      this.props.loanDetails.metadata.state
    );
    this.state = {
      isAvailableItemsVisible: isRequest,
    };
  }

  showAvailableItems = (newState = true) => {
    this.setState({ isAvailableItemsVisible: newState });
  };

  isItemDeleted = () => {
    const data = this.props.loanDetails;
    return isEmpty(data.metadata.item) && data.metadata.item_pid;
  };

  renderItem() {
    const data = this.props.loanDetails;
    return (
      !isEmpty(data.metadata.item) && (
        <ItemMetadata
          item={data.metadata.item}
          loanState={data.metadata.state}
          changeItemClickHandler={this.showAvailableItems}
        />
      )
    );
  }

  renderDeletedItem() {
    const data = this.props.loanDetails;
    return (
      this.isItemDeleted() && (
        <Message
          warning
          icon="trash alternate"
          header={`Item deleted`}
          content={`The item ${data.metadata.item_pid.value} assigned to this loan has been deleted.`}
        />
      )
    );
  }

  prepareLeftData(data) {
    const rows = [
      { name: 'Document pid', value: data.metadata.document_pid },
      {
        name: 'Item pid',
        value: data.metadata.item_pid ? (
          <LoanLinkToItem itemPid={data.metadata.item_pid}>
            {data.metadata.item_pid.value}
          </LoanLinkToItem>
        ) : (
          '-'
        ),
      },
      { name: 'Patron pid', value: data.metadata.patron_pid },
      { name: 'Pickup Location pid', value: data.metadata.pickup_location_pid },
      { name: 'State', value: data.metadata.state },
    ];
    return rows;
  }

  getDelivery(delivery) {
    if (delivery && 'method' in delivery) {
      return invenioConfig.circulation.deliveryMethods[delivery.method];
    }
    return 'NOT PROVIDED';
  }

  prepareRightData(data) {
    const { cancel_reason: reason, state } = data.metadata;
    const rows = [
      {
        name: 'Transaction date',
        value: toShortDateTime(data.metadata.transaction_date),
      },
      {
        name: 'Delivery',
        value: this.getDelivery(data.metadata.delivery),
      },
    ];
    if (state === 'CANCELLED' && !isEmpty(reason)) {
      rows.push({
        name: 'Cancel Reason',
        value: reason,
      });
    }
    return rows;
  }

  renderLoan() {
    const data = this.props.loanDetails;
    const leftRows = this.prepareLeftData(data);
    const rightRows = this.prepareRightData(data);
    return (
      <Grid padded columns={2}>
        <Grid.Column width={16}>
          <Header as="h1">Loan - {data.pid}</Header>
        </Grid.Column>
        <Grid.Column>
          <MetadataTable rows={leftRows} />
        </Grid.Column>
        <Grid.Column>
          <MetadataTable rows={rightRows} />
          {this.renderMailButton()}
        </Grid.Column>
      </Grid>
    );
  }

  renderMailButton() {
    const loan = this.props.loanDetails;
    return loan.metadata.is_overdue && <OverdueLoanSendMailModal loan={loan} />;
  }

  renderAvailableItems() {
    return (
      this.state.isAvailableItemsVisible && (
        <>
          {this.isItemDeleted() && <Divider />}
          <AvailableItems loan={this.props.loanDetails} />
        </>
      )
    );
  }

  render() {
    return (
      <Segment>
        {this.renderLoan()}
        <Divider />
        <LoanActions />
        <Divider />
        {this.renderItem()}
        {this.renderDeletedItem()}
        {this.renderAvailableItems()}
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};

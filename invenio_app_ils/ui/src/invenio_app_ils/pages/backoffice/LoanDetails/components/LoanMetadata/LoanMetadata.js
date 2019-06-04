import { invenioConfig } from '../../../../../common/config';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import { ItemMetadata } from '../ItemMetadata';
import { LoanActions } from '../LoanActions';
import { AvailableItems } from '../AvailableItems';
import { MetadataTable } from '../../../components/MetadataTable';
import isEmpty from 'lodash/isEmpty';
import { toShortDateTime } from '../../../../../common/api/date';

export default class LoanMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAvailableItemsVisible: isEmpty(this.props.loanDetails.metadata.item),
    };
  }

  showAvailableItems = (newState = true) => {
    this.setState({ isAvailableItemsVisible: newState });
  };

  isItemDeleted = () => {
    const data = this.props.loanDetails;
    return isEmpty(data.metadata.item) && data.metadata.item_pid !== '';
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
          header={`The Item ${
            data.metadata.item_pid
          } assigned to this loan has been deleted!`}
          content={[
            'If you need further assistance contact ',
            <a
              href={`mailto:${
                invenioConfig.support_email
              }?subject=Deleted Item ${data.metadata.item_pid}`}
              key="support-email"
            >
              <Icon name="mail" />
              {invenioConfig.support_email}
            </a>,
          ]}
        />
      )
    );
  }

  prepareLeftData(data) {
    const rows = [
      { name: 'Document pid', value: data.metadata.document_pid },
      { name: 'Item pid', value: data.metadata.item_pid },
      { name: 'Patron pid', value: data.metadata.patron_pid },
      { name: 'Pickup Location pid', value: data.metadata.pickup_location_pid },
      {
        name: 'Transaction Location pid',
        value: data.metadata.transaction_location_pid,
      },
      { name: 'State', value: data.metadata.state },
    ];
    return rows;
  }

  prepareRightData(data) {
    const { cancel_reason: reason, state } = data.metadata;
    const rows = [
      {
        name: 'Transaction date',
        value: toShortDateTime(data.metadata.transaction_date),
      },
      {
        name: 'Expire Date',
        value: toShortDateTime(data.metadata.request_expire_date),
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
          <Header as="h1">Loan - {data.loan_pid}</Header>
        </Grid.Column>
        <Grid.Column>
          <MetadataTable rows={leftRows} />
        </Grid.Column>
        <Grid.Column>
          <MetadataTable rows={rightRows} />
        </Grid.Column>
      </Grid>
    );
  }

  renderAvailableItems() {
    return (
      this.state.isAvailableItemsVisible && (
        <>
          <Divider />
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

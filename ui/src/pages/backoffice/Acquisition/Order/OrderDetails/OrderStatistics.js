import React from 'react';
import { Statistic } from 'semantic-ui-react';
import { formatPrice } from '@api/utils';
import { toShortDate } from '@api/date';

export class OrderStatistics extends React.Component {
  renderStatusCancelled() {
    return (
      <Statistic color="grey">
        <Statistic.Value>Cancelled</Statistic.Value>
        <Statistic.Label>
          Reason: {this.props.order.cancel_reason}
        </Statistic.Label>
      </Statistic>
    );
  }

  renderStatusReceived() {
    return (
      <Statistic color="green">
        <Statistic.Label>Delivered</Statistic.Label>
        <Statistic.Value>
          {toShortDate(this.props.order.delivery_date)}
        </Statistic.Value>
      </Statistic>
    );
  }

  renderStatusOrdered() {
    return (
      <Statistic color="yellow">
        <Statistic.Label>Expected delivery</Statistic.Label>
        <Statistic.Value>
          {toShortDate(this.props.order.expected_delivery_date)}
        </Statistic.Value>
      </Statistic>
    );
  }

  renderStatusPending() {
    return (
      <Statistic>
        <Statistic.Value>Pending</Statistic.Value>
        <Statistic.Label>???</Statistic.Label>
      </Statistic>
    );
  }

  renderStatus() {
    switch (this.props.order.status) {
      case 'CANCELLED':
        return this.renderStatusCancelled();
      case 'PENDING':
        return this.renderStatusPending();
      case 'ORDERED':
        return this.renderStatusOrdered();
      case 'RECEIVED':
        return this.renderStatusReceived();
      default:
        return null;
    }
  }

  renderItemCount() {
    const order = this.props.order;
    let received = 0;
    let ordered = 0;
    for (const orderLine of order.order_lines) {
      received += orderLine.copies_received;
      ordered += orderLine.copies_ordered;
    }
    return (
      <Statistic>
        <Statistic.Label>Received</Statistic.Label>
        <Statistic.Value>
          {received}/{ordered}
        </Statistic.Value>
        <Statistic.Label>copies</Statistic.Label>
      </Statistic>
    );
  }

  renderGrandTotal() {
    return (
      <Statistic>
        <Statistic.Label>Total</Statistic.Label>
        <Statistic.Value>
          {formatPrice(this.props.order.grand_total, false)}
        </Statistic.Value>
        <Statistic.Label>
          {this.props.order.grand_total.currency}
        </Statistic.Label>
      </Statistic>
    );
  }

  render() {
    const status = this.props.order.status;
    const widths = status === 'CANCELLED' ? 'one' : 'three';
    return (
      <Statistic.Group widths={widths} className="detail-statistics">
        {this.renderStatus()}
        {status !== 'CANCELLED' && this.renderItemCount()}
        {status !== 'CANCELLED' && this.renderGrandTotal()}
      </Statistic.Group>
    );
  }
}

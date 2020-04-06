import React from 'react';
import { Grid } from 'semantic-ui-react';
import { toShortDate } from '@api/date';
import { MetadataTable } from '@pages/backoffice/components';
import { PropTypes } from 'prop-types';

export class OrderInformation extends React.Component {
  dateOrDefault = value => {
    return value ? toShortDate(value) : '-';
  };

  render() {
    const order = this.props.order;
    const leftTable = [
      { name: 'Status', value: order.status },
      { name: 'Ordered at', value: this.dateOrDefault(order.order_date) },
      { name: 'Delivered on', value: this.dateOrDefault(order.received_date) },
      {
        name: 'Expected delivery',
        value: this.dateOrDefault(order.expected_delivery_date),
      },
    ];
    const rightTable = [
      { name: 'Vendor', value: order.vendor.name },
      { name: 'Funds', value: order.funds ? order.funds.join(', ') : null },
      { name: 'Notes', value: order.notes },
    ];
    order.status === 'CANCELLED' &&
      rightTable.push({ name: 'Cancel reason', value: order.cancel_reason });
    return (
      <Grid columns={2} id="order-info">
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

OrderInformation.propTypes = {
  order: PropTypes.object.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { toShortDateTime, toShortDate } from '@api/date';
import { KeyValueTable } from '@pages/backoffice/components';

export class OrderInformation extends React.Component {
  render() {
    const order = this.props.order;
    const leftTable = [
      { key: 'Status', value: order.status },
      { key: 'Ordered at', value: toShortDateTime(order.order_date) },
      { key: 'Delivered on', value: toShortDateTime(order.received_date) },
      {
        key: 'Expected delivery',
        value: toShortDate(order.expected_delivery_date),
      },
    ];
    const rightTable = [
      { key: 'Vendor', value: order.vendor.name },
      { key: 'Funds', value: order.funds ? order.funds.join(', ') : null },
      { key: 'Cancel reason', value: order.cancel_reason },
      { key: 'Notes', value: order.notes },
    ];
    return (
      <Grid columns={2} id="order-info">
        <Grid.Row>
          <Grid.Column>
            <KeyValueTable data={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <KeyValueTable keyWidth={3} data={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

OrderInformation.proptTypes = {
  order: PropTypes.object.isRequired,
};

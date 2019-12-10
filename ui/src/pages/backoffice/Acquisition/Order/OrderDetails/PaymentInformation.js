import React from 'react';
import { Grid, Popup, Icon } from 'semantic-ui-react';
import { formatPrice } from '@api/utils';
import { KeyValueTable } from '@pages/backoffice/components';

export class PaymentInformation extends React.Component {
  render() {
    const order = this.props.order;
    const payment = order.payment;
    const leftTable = [
      {
        key: (
          <>
            Total (local {order.grand_total_main_currency.currency})
            <Popup
              content="The total amount in the local currency."
              trigger={<Icon name="info circle" />}
            />
          </>
        ),
        value: formatPrice(order.grand_total_main_currency),
      },
      {
        key: `Total (${order.grand_total.currency})`,
        value: formatPrice(order.grand_total),
      },
      {
        key: 'Debit cost',
        value: formatPrice(payment.debit_cost),
      },
    ];
    const rightTable = [
      { key: 'Mode', value: payment.mode },
      {
        key: (
          <>
            IPR ID{' '}
            <Popup
              content="Internal purchase requisition ID"
              trigger={<Icon name="info circle" size="large" />}
            />
          </>
        ),
        value: payment.internal_purchase_requisition_id,
      },
      { key: 'Note', value: payment.debit_note },
    ];
    return (
      <Grid columns={2} id="payment-info">
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

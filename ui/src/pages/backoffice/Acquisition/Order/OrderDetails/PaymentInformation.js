import { toShortDate } from '@api/date';
import { formatPrice } from '@api/utils';
import { invenioConfig } from '@config';
import { MetadataTable } from '@pages/backoffice/components';
import React from 'react';
import { Grid, Icon, Popup } from 'semantic-ui-react';

export class PaymentInformation extends React.Component {
  render() {
    const order = this.props.order;
    const payment = order.payment;
    const leftTable = [
      {
        name: `Total (${invenioConfig.defaultCurrency})`,
        value: formatPrice(order.grand_total_main_currency),
      },
      {
        name:
          order.grand_total && order.grand_total.currency
            ? `Total (${order.grand_total.currency})`
            : 'Total',
        value: formatPrice(order.grand_total),
      },
      { name: 'Mode', value: payment.mode },
      {
        name: (
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
      { name: 'Budget code', value: payment.budget_code },
    ];
    const rightTable = [
      {
        name: `Debit cost (${invenioConfig.defaultCurrency})`,
        value: formatPrice(payment.debit_cost_main_currency),
      },
      {
        name:
          payment.debit_cost && payment.debit_cost.currency
            ? `Debit cost (${payment.debit_cost.currency})`
            : 'Debit cost',
        value: formatPrice(payment.debit_cost),
      },
      {
        name: 'Debit date',
        value: payment.debit_date ? toShortDate(payment.debit_date) : '-',
      },
      { name: 'Note', value: payment.debit_note },
    ];
    return (
      <Grid columns={2} id="payment-info">
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

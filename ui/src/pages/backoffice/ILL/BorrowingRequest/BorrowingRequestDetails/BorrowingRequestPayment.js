import { toShortDate } from '@api/date';
import { formatPrice } from '@api/utils';
import { invenioConfig } from '@config';
import { MetadataTable } from '@pages/backoffice/components';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Grid, Header, Icon, Popup, Segment } from 'semantic-ui-react';

class Payment extends React.Component {
  render() {
    const { brwReq } = this.props;
    const payment = brwReq.payment;
    const leftTable = [
      {
        name: `Total (${invenioConfig.defaultCurrency})`,
        value: formatPrice(brwReq.total_main_currency),
      },
      {
        name:
          brwReq.total && brwReq.total.currency
            ? `Total (${brwReq.total.currency})`
            : 'Total',
        value: formatPrice(brwReq.total),
      },
      { name: 'Payment mode', value: payment.mode },
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
      <Grid columns={2}>
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

export class BorrowingRequestPayment extends React.Component {
  render() {
    const brwReq = this.props.brwReq;

    return (
      <>
        <Header as="h3" attached="top">
          Payment information
        </Header>
        <Segment attached className="bo-metadata-segment">
          <Payment brwReq={brwReq} />
        </Segment>
      </>
    );
  }
}

BorrowingRequestPayment.propTypes = {
  brwReq: PropTypes.object.isRequired,
};

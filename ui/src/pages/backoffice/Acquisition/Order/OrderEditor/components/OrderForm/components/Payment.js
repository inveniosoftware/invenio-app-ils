import { invenioConfig } from '@config';
import {
  DateInputField,
  GroupField,
  PriceField,
  StringField,
  TextField,
  VocabularyField,
} from '@forms';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Funds } from './Funds';

export class Payment extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <PriceField
          label="Debit Cost"
          fieldPath="payment.debit_cost"
          currencies={currencies}
          defaultCurrency={invenioConfig.defaultCurrency}
        />
        <PriceField
          label="Debit Cost in Main Currency"
          fieldPath="payment.debit_cost_main_currency"
          currencies={currencies}
          canSelectCurrency={false}
          defaultCurrency={invenioConfig.defaultCurrency}
        />
        <DateInputField
          label="Debit Date"
          fieldPath="payment.debit_date"
          optimized
        />
        <GroupField widths="equal">
          <VocabularyField
            type={invenioConfig.vocabularies.acqOrders.acq_payment_mode}
            fieldPath={'payment.mode'}
            label="Payment mode"
            placeholder="Select payment mode..."
            required
          />
          <StringField
            label="Internal Purchase Requisition ID"
            fieldPath="payment.internal_purchase_requisition_id"
          />
        </GroupField>
        <TextField label="Debit Note" fieldPath="payment.debit_note" rows={3} />
        <Funds />
      </>
    );
  }
}

Payment.propTypes = {
  currencies: PropTypes.array.isRequired,
};

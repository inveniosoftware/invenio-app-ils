import React, { Component } from 'react';
import {
  DateInputField,
  GroupField,
  PriceField,
  StringField,
  TextField,
  VocabularyField,
} from '@forms';
import { Funds } from './Funds';
import { invenioConfig } from '@config';

export class Payment extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <PriceField
          label="Debit Cost"
          fieldPath="payment.debit_cost"
          currencies={currencies}
        />
        <PriceField
          label="Debit Cost in Main Currency"
          fieldPath="payment.debit_cost_main_currency"
          currencies={currencies}
          canSelectCurrency={false}
        />
        <DateInputField
          label="Debit Date"
          fieldPath="payment.debit_date"
          optimized
        />
        <GroupField widths="equal">
          <VocabularyField
            type={invenioConfig.vocabularies.order.acq_payment_mode}
            fieldPath={'payment.mode'}
            label="Payment mode"
            placeholder="Select payment mode..."
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

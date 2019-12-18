import React, { Component } from 'react';
import {
  DateInputField,
  GroupField,
  PriceField,
  StringField,
  TextField,
  VocabularyField,
} from '@forms';
import { invenioConfig } from '@config';

export class Payment extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <GroupField widths="equal">
          <PriceField
            label="Debit Cost"
            fieldPath="payment.debit_cost"
            currencies={currencies}
            required
          />
          <PriceField
            label="Debit Cost Main Currency"
            fieldPath="payment.debit_cost_main_currency"
            currencies={currencies}
            canSelectCurrency={false}
            required
          />
          <DateInputField
            label="Debit Date"
            fieldPath="payment.debit_date"
            optimized
          />
        </GroupField>
        <TextField label="Debit Note" fieldPath="payment.debit_note" rows={3} />
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
      </>
    );
  }
}

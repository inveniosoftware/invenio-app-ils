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
        </GroupField>

        <VocabularyField
          type={
            invenioConfig.vocabularies.illBorrowingRequests.ill_payment_mode
          }
          fieldPath={'payment.mode'}
          label="Payment mode"
          placeholder="Select payment mode..."
          required
        />
        <GroupField widths="equal">
          <StringField
            label="Internal Purchase Requisition ID"
            fieldPath="payment.internal_purchase_requisition_id"
          />
          <StringField label="Budget code" fieldPath="payment.budget_code" />
        </GroupField>
        <TextField label="Debit Note" fieldPath="payment.debit_note" rows={3} />
      </>
    );
  }
}

Payment.propTypes = {
  currencies: PropTypes.array.isRequired,
};

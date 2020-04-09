import {
  document as documentApi,
  illLibrary as illLibraryApi,
  patron as patronApi,
} from '@api';
import {
  serializeDocument,
  serializeLibrary,
  serializePatron,
} from '@components/ESSelector/serializer';
import { invenioConfig } from '@config';
import {
  DateInputField,
  GroupField,
  PriceField,
  SelectField,
  SelectorField,
  StringField,
  TextField,
  VocabularyField,
} from '@forms';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class OrderInfo extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <SelectorField
          required
          emptyHeader="No library selected"
          emptyDescription="Please select a library."
          fieldPath="library"
          errorPath="library_pid"
          label="Library"
          placeholder="Search for a library..."
          query={illLibraryApi.list}
          serializer={serializeLibrary}
        />
        <VocabularyField
          type={invenioConfig.vocabularies.illBorrowingRequests.ill_item_type}
          fieldPath="type"
          label="Item type"
          placeholder="Select item type..."
          required
        />

        <SelectorField
          required
          emptyHeader="No document selected"
          emptyDescription="Please select a document."
          fieldPath="document"
          errorPath="document_pid"
          label="Document"
          placeholder="Search for a document..."
          query={documentApi.list}
          serializer={serializeDocument}
        />
        <SelectorField
          required
          emptyHeader="No patron selected"
          emptyDescription="Please select a patron."
          fieldPath="patron"
          errorPath="patron_pid"
          label="Patron"
          placeholder="Search for a patron..."
          query={patronApi.list}
          serializer={serializePatron}
        />

        <GroupField widths="equal">
          <SelectField
            required
            search
            label="Status"
            fieldPath="status"
            options={invenioConfig.illBorrowingRequests.statuses}
          />
          <StringField label="Cancel Reason" fieldPath="cancel_reason" />
        </GroupField>

        <GroupField widths="equal">
          <DateInputField
            label="Request date"
            fieldPath="request_date"
            optimized
          />
          <DateInputField
            label="Expected Delivery Date"
            fieldPath="expected_delivery_date"
            optimized
          />
          <DateInputField
            label="Received Date"
            fieldPath="received_date"
            optimized
          />
        </GroupField>

        <GroupField widths="equal">
          <StringField label="Loan PID" fieldPath="loan_pid" />
          <DateInputField
            label="Loan end date"
            fieldPath="loan_end_date"
            optimized
          />
        </GroupField>

        <GroupField widths="equal">
          <PriceField
            label="Total"
            fieldPath="total"
            currencies={currencies}
            defaultCurrency={invenioConfig.defaultCurrency}
          />
          <PriceField
            label="Total Main Currency"
            fieldPath="total_main_currency"
            currencies={currencies}
            canSelectCurrency={false}
            defaultCurrency={invenioConfig.defaultCurrency}
          />
        </GroupField>

        <TextField label="Notes" fieldPath="notes" rows={3} />
      </>
    );
  }
}

OrderInfo.propTypes = {
  currencies: PropTypes.array.isRequired,
};

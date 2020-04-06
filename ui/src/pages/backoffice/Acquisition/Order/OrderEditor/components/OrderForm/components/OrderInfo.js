import React, { Component } from 'react';
import {
  DateInputField,
  GroupField,
  PriceField,
  SelectField,
  SelectorField,
  StringField,
  TextField,
} from '@forms';
import { invenioConfig } from '@config';
import { serializeVendor } from '@components/ESSelector/serializer';
import { acqVendor as vendorApi } from '@api';

export class OrderInfo extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <SelectorField
          required
          emptyHeader="No vendor selected"
          emptyDescription="Please select a vendor."
          fieldPath="vendor"
          errorPath="vendor_pid"
          label="Vendor"
          placeholder="Search for a vendor..."
          query={vendorApi.list}
          serializer={serializeVendor}
        />
        <GroupField widths="equal">
          <SelectField
            required
            search
            label="Status"
            fieldPath="status"
            options={invenioConfig.acqOrders.statuses}
          />
          <StringField label="Cancel Reason" fieldPath="cancel_reason" />
        </GroupField>

        <GroupField widths="equal">
          <DateInputField
            label="Order Date"
            fieldPath="order_date"
            optimized
            required
          />
          <DateInputField
            label="Expected Delivery Date"
            fieldPath="expected_delivery_date"
            optimized
          />
        </GroupField>

        <PriceField
          label="Grand Total"
          fieldPath="grand_total"
          currencies={currencies}
        />
        <PriceField
          label="Grand Total Main Currency"
          fieldPath="grand_total_main_currency"
          currencies={currencies}
          canSelectCurrency={false}
        />
        <DateInputField
          label="Received date"
          fieldPath="received_date"
          optimized
        />

        <TextField label="Notes" fieldPath="notes" rows={3} />
      </>
    );
  }
}

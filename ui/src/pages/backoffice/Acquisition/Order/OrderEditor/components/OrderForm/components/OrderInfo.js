import { acqVendor as vendorApi } from '@api';
import { serializeVendor } from '@components/ESSelector/serializer';
import { invenioConfig } from '@config';
import {
  DateInputField,
  GroupField,
  PriceField,
  SelectField,
  SelectorField,
  StringField,
  TextField,
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
          label="Total"
          fieldPath="grand_total"
          currencies={currencies}
          defaultCurrency={invenioConfig.defaultCurrency}
        />
        <PriceField
          label="Total Main Currency"
          fieldPath="grand_total_main_currency"
          currencies={currencies}
          canSelectCurrency={false}
          defaultCurrency={invenioConfig.defaultCurrency}
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

OrderInfo.propTypes = {
  currencies: PropTypes.array.isRequired,
};

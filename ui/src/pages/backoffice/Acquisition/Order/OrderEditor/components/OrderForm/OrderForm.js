import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { getIn } from 'formik';
import { SelectorField, TextField } from '@forms';
import { Loader } from '@components';
import { order as orderApi, vendor as vendorApi } from '@api/acquisition';
import { AcquisitionRoutes } from '@routes/urls';
import { goTo } from '@history';
import {
  BaseForm,
  DateInputField,
  GroupField,
  PriceField,
  SelectField,
  StringField,
} from '@forms';
import { serializeVendor } from '@components/ESSelector/serializer';
import { Funds, OrderLines, Payment } from './components';
import { vocabulary as vocabularyApi } from '@api';
import { invenioConfig } from '@config';
import { sessionManager } from '@authentication/services';
import _has from 'lodash/has';

const orderSubmitSerializer = (values, newRecord) => {
  const submitValues = { ...values };
  if (newRecord) {
    submitValues.created_by_pid = sessionManager.user.id;
  }
  submitValues.vendor_pid = values.vendor.pid;
  submitValues.order_lines = values.resolved_order_lines.map(line => {
    if (line.document) {
      line.document_pid = _has(line.document, 'id')
        ? line.document.id
        : line.document.pid;
    }
    return line;
  });
  return submitValues;
};

export class OrderForm extends Component {
  state = {
    isLoading: true,
    error: null,
    currencies: [],
  };

  componentDidMount() {
    this.fetchCurrencies();
  }

  query = () => {
    const searchQuery = vocabularyApi
      .query()
      .withType(invenioConfig.vocabularies.order.currencies)
      .qs();
    return vocabularyApi.list(searchQuery);
  };

  serializer = hit => ({
    key: hit.metadata.key,
    value: hit.metadata.key,
    text: hit.metadata.key,
  });

  fetchCurrencies = async () => {
    try {
      const response = await this.query();
      const currencies = response.data.hits.map(hit => this.serializer(hit));
      this.setState({ isLoading: false, currencies: currencies, error: null });
    } catch (error) {
      this.setState({
        isloading: false,
        options: [{ key: '', value: '', text: 'Failed to load currencies.' }],
        error: {
          content: 'Failed to load currencies.',
          pointing: 'above',
        },
      });
    }
  };

  createOrder = data => {
    return orderApi.create(data);
  };

  updateOrder = (pid, data) => {
    return orderApi.update(pid, data);
  };

  successCallback = response => {
    goTo(
      AcquisitionRoutes.orderDetailsFor(getIn(response, 'data.metadata.pid'))
    );
  };

  getDefaultValues() {
    const defaultCurrency = invenioConfig.order.defaultCurrency;
    return {
      create_by: sessionManager.user.id,
      grand_total: { currency: defaultCurrency },
      grand_total_main_currency: { currency: defaultCurrency },
      payment: {
        debit_cost: { currency: defaultCurrency },
        debit_cost_main_currency: { currency: defaultCurrency },
      },
    };
  }

  render() {
    const { currencies, isLoading } = this.state;
    return (
      <BaseForm
        initialValues={
          this.props.data ? this.props.data.metadata : this.getDefaultValues()
        }
        editApiMethod={this.updateOrder}
        createApiMethod={this.createOrder}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid ? this.props.pid : undefined}
        submitSerializer={orderSubmitSerializer}
      >
        <Header dividing>Order information</Header>
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
            options={invenioConfig.orders.statuses}
          />
          <StringField label="Cancel Reason" fieldPath="cancel_reason" />
        </GroupField>

        <TextField label="Notes" fieldPath="notes" rows={3} />
        <Funds />

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
          <DateInputField
            label="Received date"
            fieldPath="received_date"
            optimized
          />
        </GroupField>

        <Loader isLoading={isLoading}>
          <GroupField widths="equal">
            <PriceField
              label="Grand Total"
              fieldPath="grand_total"
              currencies={currencies}
              required
            />
            <PriceField
              label="Grand Total in Main Currency"
              fieldPath="grand_total_main_currency"
              currencies={currencies}
              canSelectCurrency={false}
              required
            />
          </GroupField>
        </Loader>

        <Header dividing>Payment information</Header>
        <Loader isLoading={isLoading}>
          <Payment currencies={currencies} />
        </Loader>

        <Header dividing>Order lines</Header>
        <Loader isLoading={isLoading}>
          <OrderLines currencies={currencies} />
        </Loader>
      </BaseForm>
    );
  }
}

OrderForm.propTypes = {
  data: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};

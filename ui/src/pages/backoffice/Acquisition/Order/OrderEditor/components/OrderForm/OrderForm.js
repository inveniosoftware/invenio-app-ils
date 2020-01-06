import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Grid } from 'semantic-ui-react';
import { getIn } from 'formik';
import { Loader } from '@components';
import { order as orderApi } from '@api/acquisition';
import { AcquisitionRoutes } from '@routes/urls';
import { goTo } from '@history';
import { BaseForm } from '@forms';
import { OrderInfo, OrderLines, Payment } from './components';
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
    if (line.patron) {
      line.patron_pid = _has(line.patron, 'id')
        ? line.patron.id
        : line.patron.pid;
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
    const defaultCurrency = invenioConfig.orders.defaultCurrency;
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
        <Grid columns="equal">
          <Grid.Row stretched>
            <Grid.Column>
              <Segment raised>
                <Header dividing>Order information</Header>
                <Loader isLoading={isLoading}>
                  <OrderInfo currencies={currencies} />
                </Loader>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment raised>
                <Header dividing>Payment information</Header>
                <Loader isLoading={isLoading}>
                  <Payment currencies={currencies} />
                </Loader>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

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

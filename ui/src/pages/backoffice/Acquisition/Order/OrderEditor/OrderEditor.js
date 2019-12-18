import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { order as orderApi } from '@api/acquisition/order';
import { OrderForm } from './components';

export class OrderEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: true,
      error: {},
    };
  }

  fetchOrder = async orderPid => {
    try {
      const response = await orderApi.get(orderPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.orderPid) {
      this.fetchOrder(this.props.match.params.orderPid);
    }
  }

  renderForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <OrderForm
            pid={pid}
            data={data}
            title="Edit order"
            successSubmitMessage="The order was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { orderPid },
      },
    } = this.props;
    const isEditForm = orderPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderForm(orderPid)
        ) : (
          <OrderForm
            title="Create new acquisition order"
            successSubmitMessage="The order was successfully created."
          />
        )}
      </>
    );
  }
}

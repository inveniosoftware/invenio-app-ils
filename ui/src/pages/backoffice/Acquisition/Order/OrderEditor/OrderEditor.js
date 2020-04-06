import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { acqOrder as orderApi } from '@api';
import { OrderForm } from './components';
import _get from 'lodash/get';

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

  get documentRequest() {
    const request = _get(this.props, 'location.state', null);
    if (!request) return null;
    return {
      documentRequestPid: request.pid,
      metadata: {
        order_lines: [
          {
            document_pid: _get(request, 'metadata.document_pid'),
          },
        ],
      },
    };
  }

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
            data={this.documentRequest}
          />
        )}
      </>
    );
  }
}

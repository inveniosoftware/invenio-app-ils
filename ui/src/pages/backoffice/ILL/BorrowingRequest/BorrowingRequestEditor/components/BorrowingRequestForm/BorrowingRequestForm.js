import {
  illBorrowingRequest as illBorrowingRequestApi,
  vocabulary as vocabularyApi,
} from '@api';
import { Loader } from '@components';
import { invenioConfig } from '@config';
import { BaseForm } from '@forms';
import { goTo } from '@history';
import { ILLRoutes } from '@routes/urls';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { OrderInfo, Payment } from './components';
import { withCancel } from '@api/utils';

const submitSerializer = values => {
  const submitValues = { ...values };
  submitValues.library_pid = values.library.pid;
  submitValues.document_pid = values.document.pid;
  submitValues.patron_pid = values.patron.pid;
  return submitValues;
};

export class BorrowingRequestForm extends Component {
  state = {
    isLoading: true,
    error: null,
    currencies: [],
  };

  componentDidMount() {
    this.fetchCurrencies();
  }

  componentWillUnmount() {
    this.cancellableFetchData && this.cancellableFetchData.cancel();
  }

  get buttons() {
    const isEditing = this.props.pid;
    if (isEditing) {
      return [
        {
          name: 'update',
          content: 'Update borrowing request',
          primary: true,
          type: 'submit',
        },
      ];
    }

    return [
      {
        name: 'create',
        content: 'Create borrowing request',
        primary: true,
        type: 'submit',
      },
    ];
  }

  query = () => {
    const searchQuery = vocabularyApi
      .query()
      .withType(invenioConfig.vocabularies.currencies)
      .qs();
    return vocabularyApi.list(searchQuery);
  };

  serializer = hit => ({
    key: hit.metadata.key,
    value: hit.metadata.key,
    text: hit.metadata.key,
  });

  fetchCurrencies = async () => {
    this.cancellableFetchData = withCancel(this.query());
    try {
      const response = await this.cancellableFetchData.promise;
      const currencies = response.data.hits.map(hit => this.serializer(hit));
      this.setState({ isLoading: false, currencies: currencies, error: null });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({
          isloading: false,
          currencies: [
            { key: '', value: '', text: 'Failed to load currencies.' },
          ],
          error: {
            content: 'Failed to load currencies.',
            pointing: 'above',
          },
        });
      }
    }
  };

  updateBorrowingRequest = (pid, data) => {
    return illBorrowingRequestApi.update(pid, data);
  };

  createBorrowingRequest = data => {
    return illBorrowingRequestApi.create(data);
  };

  successCallback = (response, submitButton) => {
    const borrowingRequest = getIn(response, 'data');
    goTo(ILLRoutes.borrowingRequestDetailsFor(borrowingRequest.metadata.pid));
  };

  render() {
    const { currencies, isLoading } = this.state;
    return (
      <BaseForm
        initialValues={this.props.data ? this.props.data.metadata : {}}
        editApiMethod={this.updateBorrowingRequest}
        createApiMethod={this.createBorrowingRequest}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid}
        submitSerializer={submitSerializer}
        buttons={this.buttons}
      >
        <Segment raised>
          <Header dividing>Order information</Header>
          <Loader isLoading={isLoading}>
            <OrderInfo currencies={currencies} />
          </Loader>
        </Segment>
        <Segment raised>
          <Header dividing>Payment information</Header>
          <Loader isLoading={isLoading}>
            <Payment currencies={currencies} />
          </Loader>
        </Segment>
      </BaseForm>
    );
  }
}

BorrowingRequestForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};

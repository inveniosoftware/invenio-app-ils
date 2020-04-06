import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { illBorrowingRequest as borrowingRequestApi } from '@api';
import { BorrowingRequestForm } from './components';

export class BorrowingRequestEditor extends Component {
  state = {
    data: {},
    isLoading: true,
    error: {},
  };

  fetchBorrowingRequest = async borrowingRequestPid => {
    try {
      const response = await borrowingRequestApi.get(borrowingRequestPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.borrowingRequestPid) {
      this.fetchBorrowingRequest(this.props.match.params.borrowingRequestPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <BorrowingRequestForm
            pid={pid}
            data={data}
            title="Edit borrowing request"
            successSubmitMessage="The borrowing request was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { borrowingRequestPid },
      },
    } = this.props;
    const isEditForm = borrowingRequestPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(borrowingRequestPid)
        ) : (
          <BorrowingRequestForm
            title="Create new borrowing request"
            successSubmitMessage="The borrowing request was successfully created."
          />
        )}
      </>
    );
  }
}

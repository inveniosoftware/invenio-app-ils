import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { acqVendor as vendorApi } from '@api';
import { VendorForm } from './components';

export class VendorEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: true,
      error: {},
    };
  }

  fetchVendor = async vendorPid => {
    try {
      const response = await vendorApi.get(vendorPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.vendorPid) {
      this.fetchVendor(this.props.match.params.vendorPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <VendorForm
            pid={pid}
            data={data}
            title="Edit vendor"
            successSubmitMessage="The vendor was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { vendorPid },
      },
    } = this.props;
    const isEditForm = vendorPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(vendorPid)
        ) : (
          <VendorForm
            title="Create new vendor"
            successSubmitMessage="The vendor was successfully created."
          />
        )}
      </>
    );
  }
}

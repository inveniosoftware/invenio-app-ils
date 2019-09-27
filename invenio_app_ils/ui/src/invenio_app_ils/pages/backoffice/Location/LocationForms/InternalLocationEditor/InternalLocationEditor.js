// EditUserDialog.js
import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { internalLocation as internalLocationApi } from '../../../../../common/api/locations/internalLocation';
import { InternalLocationForm } from './components';

export class InternalLocationEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: true,
      error: {},
    };
  }

  fetchInternalLocation = async ilocationPid => {
    try {
      const response = await internalLocationApi.get(ilocationPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.ilocationPid) {
      this.fetchInternalLocation(this.props.match.params.ilocationPid);
    }
  }

  renderEditForm = () => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <InternalLocationForm
            data={data}
            title="Edit internal location"
            successSubmitMessage="Your internal location has been updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { ilocationPid },
      },
    } = this.props;
    const isEditForm = ilocationPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm()
        ) : (
          <InternalLocationForm
            title="Create new internal location"
            successSubmitMessage="Your internal location has been created."
          />
        )}
      </>
    );
  }
}

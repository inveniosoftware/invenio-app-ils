import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { internalLocation as internalLocationApi } from '@api/locations/internalLocation';
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

  renderEditForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <InternalLocationForm
            pid={pid}
            data={data}
            title="Edit internal location"
            successSubmitMessage="The internal location was successfully updated."
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
          this.renderEditForm(ilocationPid)
        ) : (
          <InternalLocationForm
            title="Create new internal location"
            successSubmitMessage="The internal location was successfully created."
          />
        )}
      </>
    );
  }
}

// EditUserDialog.js
import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { location as locationApi } from '../../../../../common/api/locations/location';
import { LocationForm } from './components';

export class LocationEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: true,
      error: {},
    };
  }

  fetchLocation = async locationPid => {
    try {
      const response = await locationApi.get(locationPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.locationPid) {
      this.fetchLocation(this.props.match.params.locationPid);
    }
  }

  renderEditForm = () => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <LocationForm
            data={data}
            title="Edit location"
            successSubmitMessage="Your location has been updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { locationPid },
      },
    } = this.props;
    const isEditForm = locationPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm()
        ) : (
          <LocationForm
            title="Create new location"
            successSubmitMessage="Your location has been created."
          />
        )}
      </>
    );
  }
}

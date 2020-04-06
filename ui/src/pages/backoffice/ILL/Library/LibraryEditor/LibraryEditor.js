import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { illLibrary as libraryApi } from '@api';
import { LibraryForm } from './components';

export class LibraryEditor extends Component {
  state = {
    data: {},
    isLoading: true,
    error: {},
  };

  fetchlibrary = async libraryPid => {
    try {
      const response = await libraryApi.get(libraryPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.libraryPid) {
      this.fetchlibrary(this.props.match.params.libraryPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <LibraryForm
            pid={pid}
            data={data}
            title="Edit library"
            successSubmitMessage="The library was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { libraryPid },
      },
    } = this.props;
    const isEditForm = libraryPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(libraryPid)
        ) : (
          <LibraryForm
            title="Create new library"
            successSubmitMessage="The library was successfully created."
          />
        )}
      </>
    );
  }
}

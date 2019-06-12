import React, { Component } from 'react';
import { Loader, Error } from '..';

export const withDataContainer = callback => WrappedComponent =>
  class extends Component {
    componentDidMount() {
      callback(this.props);
    }

    render() {
      const { isLoading, error, data } = this.props;
      return (
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <WrappedComponent data={data} />
          </Error>
        </Loader>
      );
    }
  };

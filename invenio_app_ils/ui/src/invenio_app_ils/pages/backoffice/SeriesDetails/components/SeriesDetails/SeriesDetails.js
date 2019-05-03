import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { SeriesMetadata } from '../';
import { SeriesDocuments } from '../SeriesDocuments';

export default class SeriesDetails extends Component {
  render() {
    const { isLoading, data, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <SeriesMetadata />
          <SeriesDocuments series={data} />
        </Error>
      </Loader>
    );
  }
}

SeriesDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};

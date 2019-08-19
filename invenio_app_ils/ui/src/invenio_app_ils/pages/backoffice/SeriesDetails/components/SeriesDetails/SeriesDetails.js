import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { SeriesDocuments } from '../SeriesDocuments';
import { SeriesMetadata } from '../';
import { SeriesRelations } from '../SeriesRelations';
import isEmpty from 'lodash/isEmpty';
import { SeriesMultipartMonographs } from '../SeriesMultipartMonographs';

export default class SeriesDetails extends Component {
  render() {
    const { data, isLoading, error, relations } = this.props;
    const isMultipart =
      !isEmpty(data) &&
      data.metadata.mode_of_issuance === 'MULTIPART_MONOGRAPH';
    const isSerial =
      !isEmpty(data) && data.metadata.mode_of_issuance === 'SERIAL';
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <SeriesMetadata />
          <SeriesDocuments series={data} />
          {isSerial && <SeriesMultipartMonographs series={data} />}
          {isMultipart && <SeriesRelations relations={relations} />}
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

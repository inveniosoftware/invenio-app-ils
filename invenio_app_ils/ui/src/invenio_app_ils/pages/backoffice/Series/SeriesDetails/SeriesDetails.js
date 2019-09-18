import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { Loader, Error } from '../../../../common/components';
import {
  SeriesDocuments,
  SeriesMetadata,
  SeriesMultipartMonographs,
  SeriesRelations,
} from './components';
import history from '../../../../history';

export default class SeriesDetails extends Component {
  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Series') {
        this.props.fetchSeriesDetails(loc.state.pid);
      }
    });
    this.props.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { data, isLoading, error } = this.props;

    const isMultipart =
      !isEmpty(data) &&
      data.metadata.mode_of_issuance === 'MULTIPART_MONOGRAPH';
    const isSerial =
      !isEmpty(data) && data.metadata.mode_of_issuance === 'SERIAL';
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <SeriesMetadata />
            <SeriesDocuments series={data} />
            {isSerial && <SeriesMultipartMonographs series={data} />}
            {isMultipart && <SeriesRelations />}
          </Error>
        </Loader>
      </Container>
    );
  }
}

SeriesDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
};

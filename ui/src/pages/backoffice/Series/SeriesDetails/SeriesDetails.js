import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import {
  SeriesDocuments,
  SeriesMetadata,
  SeriesMultipartMonographs,
  SeriesRelations,
} from './components';
import history from '@history';

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
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <SeriesMetadata />
            <SeriesDocuments />
            <SeriesMultipartMonographs />
            <SeriesRelations />
          </Error>
        </Loader>
      </Container>
    );
  }
}

SeriesDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  error: PropTypes.object,
};

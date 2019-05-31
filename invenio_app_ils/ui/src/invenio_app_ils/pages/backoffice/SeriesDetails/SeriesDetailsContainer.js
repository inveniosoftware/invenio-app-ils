import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { SeriesDetails } from './components';

export default class SeriesDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteSeries = this.props.deleteSeries;
    this.fetchSeriesDetails = this.props.fetchSeriesDetails;
  }

  componentDidMount() {
    this.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  render() {
    return (
      <Container>
        <SeriesDetails />
      </Container>
    );
  }
}

SeriesDetailsContainer.propTypes = {
  deleteSeries: PropTypes.func.isRequired,
  fetchSeriesDetails: PropTypes.func.isRequired,
};

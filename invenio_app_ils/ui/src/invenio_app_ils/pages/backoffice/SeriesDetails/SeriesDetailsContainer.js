import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { SeriesDetails } from './components';
import history from '../../../history';

export default class SeriesDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteSeries = this.props.deleteSeries;
    this.fetchSeriesDetails = this.props.fetchSeriesDetails;
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Series') {
        this.fetchSeriesDetails(loc.state.pid);
      }
    });
    this.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  componentWillUnmount() {
    this.unlisten();
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

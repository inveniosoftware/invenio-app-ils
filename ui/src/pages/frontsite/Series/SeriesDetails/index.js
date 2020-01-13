import { connect } from 'react-redux';
import { fetchSeriesDetails } from './state/actions';
import SeriesDetailsContainerComponent from './SeriesDetails';

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: pid => dispatch(fetchSeriesDetails(pid)),
});

const mapStateToProps = state => ({
  isLoading: state.seriesDetailsFront.isLoading,
  series: state.seriesDetailsFront.data,
  hasError: state.seriesDetailsFront.hasError,
});

export const SeriesDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDetailsContainerComponent);

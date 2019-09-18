import { connect } from 'react-redux';
import { fetchSeriesDetails } from './state/actions';
import SeriesDetailsComponent from './SeriesDetails';

const mapStateToProps = state => ({
  isLoading: state.seriesDetails.isLoading,
  data: state.seriesDetails.data,
  error: state.seriesDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriesPid => dispatch(fetchSeriesDetails(seriesPid)),
});

export const SeriesDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDetailsComponent);

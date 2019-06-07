import { connect } from 'react-redux';
import SeriesDetailsComponent from './SeriesDetails';

const mapStateToProps = state => ({
  isLoading: state.seriesDetails.isLoading,
  data: state.seriesDetails.data,
  error: state.seriesDetails.error,
  hasError: state.seriesDetails.hasError,
});

export const SeriesDetails = connect(mapStateToProps)(SeriesDetailsComponent);

import { connect } from 'react-redux';
import SeriesMetadataComponent from './SeriesMetadata';
import { fetchSeriesDetails } from '../../state/actions';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  error: state.seriesDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriesPid => dispatch(fetchSeriesDetails(seriesPid)),
});

export const SeriesMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesMetadataComponent);

import { connect } from 'react-redux';
import { deleteSeries, fetchSeriesDetails } from './state/actions';
import SeriesDetailsComponent from './SeriesDetails';
import SeriesActionMenuComponent from './SeriesActionMenu';

const mapStateToProps = state => ({
  isLoading: state.seriesDetails.isLoading,
  error: state.seriesDetails.error,
  data: state.seriesDetails.data,
  relations: state.seriesRelations.data,
  documentsInSeries: state.seriesDocuments.data,
  multipartMonographsInSeries: state.seriesMultipartMonographs.data,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriesPid => dispatch(fetchSeriesDetails(seriesPid)),
});

const mapDeleteDispatch = dispatch => ({
  deleteSeries: seriesPid => dispatch(deleteSeries(seriesPid)),
});

export const SeriesDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDetailsComponent);

export const SeriesActionMenu = connect(
  mapStateToProps,
  mapDeleteDispatch
)(SeriesActionMenuComponent);

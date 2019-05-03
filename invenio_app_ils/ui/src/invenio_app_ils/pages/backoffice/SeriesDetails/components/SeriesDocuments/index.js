import { connect } from 'react-redux';
import { fetchSeriesDocuments } from './state/actions';
import SeriesDocumentsComponent from './SeriesDocuments';

const mapStateToProps = state => ({
  data: state.seriesDocuments.data,
  error: state.seriesDocuments.error,
  isLoading: state.seriesDocuments.isLoading,
  hasError: state.seriesDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDocuments: seriesPid => dispatch(fetchSeriesDocuments(seriesPid)),
});

export const SeriesDocuments = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDocumentsComponent);

import { connect } from 'react-redux';
import { fetchSeriesDocuments } from './state/actions';
import SeriesDocumentsComponent from './SeriesDocuments';

const mapStateToProps = state => ({
  seriesDocuments: state.seriesDocuments.data,
  error: state.seriesDocuments.error,
  isLoading: state.seriesDocuments.isLoading,
  seriesDetails: state.seriesDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDocuments: (seriesPid, moi) =>
    dispatch(fetchSeriesDocuments(seriesPid, moi)),
});

export const SeriesDocuments = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesDocumentsComponent);

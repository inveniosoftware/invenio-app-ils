import { connect } from 'react-redux';
import { fetchSeriesMultipartMonographs } from './state/actions';
import SeriesMultipartMonographsComponent from './SeriesMultipartMonographs';

const mapStateToProps = state => ({
  data: state.seriesMultipartMonographs.data,
  error: state.seriesMultipartMonographs.error,
  isLoading: state.seriesMultipartMonographs.isLoading,
  hasError: state.seriesMultipartMonographs.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesMultipartMonographs: seriesPid =>
    dispatch(fetchSeriesMultipartMonographs(seriesPid)),
});

export const SeriesMultipartMonographs = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesMultipartMonographsComponent);

import { connect } from 'react-redux';
import { deleteSeries, fetchSeriesDetails } from './state/actions';
import SeriesDetailsContainerComponent from './SeriesDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriesPid => dispatch(fetchSeriesDetails(seriesPid)),
  deleteSeries: seriesPid => dispatch(deleteSeries(seriesPid)),
});

export const SeriesDetailsContainer = connect(
  null,
  mapDispatchToProps
)(SeriesDetailsContainerComponent);

import { connect } from 'react-redux';
import { fetchSeriesDetails } from './state/actions';
import SeriesDetailsContainerComponent from './SeriesDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriesPid => dispatch(fetchSeriesDetails(seriesPid)),
});

export const SeriesDetailsContainer = connect(
  null,
  mapDispatchToProps
)(SeriesDetailsContainerComponent);

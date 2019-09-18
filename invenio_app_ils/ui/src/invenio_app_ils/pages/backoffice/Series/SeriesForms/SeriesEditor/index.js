import { connect } from 'react-redux';

import { fetchSeriesDetails } from '../../SeriesDetails/state/actions';
import { SeriesEditor as SeriesEditorComponent } from './SeriesEditor';

const mapStateToProps = state => ({
  isLoading: state.seriesDetails.isLoading,
  data: state.seriesDetails.data,
  error: state.seriesDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: seriedPid => dispatch(fetchSeriesDetails(seriedPid)),
});

export const SeriesEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesEditorComponent);

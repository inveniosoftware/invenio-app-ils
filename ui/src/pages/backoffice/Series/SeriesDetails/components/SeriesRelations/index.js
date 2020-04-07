import { connect } from 'react-redux';

import SeriesRelationsComponent from './SeriesRelations';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const SeriesRelations = connect(
  mapStateToProps,
  null
)(SeriesRelationsComponent);

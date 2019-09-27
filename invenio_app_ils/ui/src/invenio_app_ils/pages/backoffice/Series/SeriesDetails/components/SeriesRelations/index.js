import { connect } from 'react-redux';

import SeriesRelationsComponent from './SeriesRelations';
import { createRelations, deleteRelations } from './state/actions';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  error: state.seriesRelations.error,
  isLoading: state.seriesRelations.isLoading,
  relations: state.seriesRelations.data,
});

const mapDispatchToProps = dispatch => ({
  createRelations: (seriesPid, relations) =>
    dispatch(createRelations(seriesPid, relations)),
  deleteRelations: (seriesPid, relations) =>
    dispatch(deleteRelations(seriesPid, relations)),
});

export const SeriesRelations = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesRelationsComponent);

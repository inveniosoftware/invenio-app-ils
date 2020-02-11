import { connect } from 'react-redux';

import SeriesSiblingsComponent from './SeriesSiblings';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const SeriesSiblings = connect(
  mapStateToProps,
  null
)(SeriesSiblingsComponent);

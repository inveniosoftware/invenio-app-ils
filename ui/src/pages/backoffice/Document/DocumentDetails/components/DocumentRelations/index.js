import { connect } from 'react-redux';

import DocumentSiblingsComponent from './DocumentSiblings';
import DocumentSeriesComponent from './DocumentSeries';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const DocumentSeries = connect(
  mapStateToProps,
  null
)(DocumentSeriesComponent);

export const DocumentSiblings = connect(
  mapStateToProps,
  null
)(DocumentSiblingsComponent);

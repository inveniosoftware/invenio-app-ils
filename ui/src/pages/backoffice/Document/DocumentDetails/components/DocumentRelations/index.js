import { connect } from 'react-redux';

import DocumentSiblingsComponent from './DocumentSiblings';
import DocumentSeriesComponent from './DocumentSeries';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentRelations.error,
  isLoading: state.documentRelations.isLoading,
  relations: state.documentRelations.data,
});

export const DocumentSeries = connect(
  mapStateToProps,
  null
)(DocumentSeriesComponent);

export const DocumentSiblings = connect(
  mapStateToProps,
  null
)(DocumentSiblingsComponent);

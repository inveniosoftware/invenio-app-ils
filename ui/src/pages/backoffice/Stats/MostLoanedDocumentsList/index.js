import { connect } from 'react-redux';
import { fetchMostLoanedDocuments } from './state/actions';
import MostLoanedDocumentsListComponent from './MostLoanedDocumentsList';

const mapStateToProps = state => ({
  data: state.statsMostLoanedDocuments.data,
  error: state.statsMostLoanedDocuments.error,
  isLoading: state.statsMostLoanedDocuments.isLoading,
  hasError: state.statsMostLoanedDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostLoanedDocuments: (startDate, endDate) =>
    dispatch(fetchMostLoanedDocuments(startDate, endDate)),
});

export const MostLoanedDocumentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostLoanedDocumentsListComponent);

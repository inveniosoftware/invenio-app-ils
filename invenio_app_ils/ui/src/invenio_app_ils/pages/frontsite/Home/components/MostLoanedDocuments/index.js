import { connect } from 'react-redux';
import { fetchMostLoanedDocuments } from './state/actions';
import MostLoanedDocumentsComponent from './MostLoanedDocuments';

const mapStateToProps = state => ({
  data: state.mostLoanedDocuments.data,
  error: state.mostLoanedDocuments.error,
  isLoading: state.mostLoanedDocuments.isLoading,
  hasError: state.mostLoanedDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostLoanedDocuments: () => dispatch(fetchMostLoanedDocuments()),
});

export const MostLoanedDocuments = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostLoanedDocumentsComponent);

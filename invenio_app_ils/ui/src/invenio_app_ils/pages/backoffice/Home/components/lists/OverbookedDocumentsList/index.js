import { connect } from 'react-redux';
import { fetchOverbookedDocuments } from './state/actions';
import OverbookedDocumentsListComponent from './OverbookedDocumentsList';

const mapStateToProps = state => ({
  data: state.overbookedDocuments.data,
  error: state.overbookedDocuments.error,
  isLoading: state.overbookedDocuments.isLoading,
  hasError: state.overbookedDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchOverbookedDocuments: () => dispatch(fetchOverbookedDocuments()),
});

export const OverbookedDocumentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(OverbookedDocumentsListComponent);

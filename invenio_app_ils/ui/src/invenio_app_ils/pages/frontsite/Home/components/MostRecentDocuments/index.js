import { connect } from 'react-redux';
import { fetchMostRecentDocuments } from './state/actions';
import MostRecentDocumentsComponent from './MostRecentDocuments';

const mapStateToProps = state => ({
  data: state.mostRecentDocuments.data,
  error: state.mostRecentDocuments.error,
  isLoading: state.mostRecentDocuments.isLoading,
  hasError: state.mostRecentDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostRecentDocuments: () => dispatch(fetchMostRecentDocuments()),
});

export const MostRecentDocuments = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostRecentDocumentsComponent);

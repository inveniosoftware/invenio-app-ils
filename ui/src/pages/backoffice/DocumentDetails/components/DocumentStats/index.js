import { connect } from 'react-redux';
import { fetchDocumentStats } from './state/actions';
import DocumentStatsComponent from './DocumentStats';

const mapStateToProps = state => ({
  data: state.documentStats.data,
  error: state.documentStats.error,
  isLoading: state.documentStats.isLoading,
  hasError: state.documentStats.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentStats: args => dispatch(fetchDocumentStats(args)),
});

export const DocumentStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentStatsComponent);

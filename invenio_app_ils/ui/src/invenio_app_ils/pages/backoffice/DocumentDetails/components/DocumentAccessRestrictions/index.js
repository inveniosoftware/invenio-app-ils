import { connect } from 'react-redux';
import { setRestrictionsOnDocument } from './state/actions';
import DocumentAccessRestrictionsComponent from './DocumentAccessRestrictions';

const mapStateToProps = state => ({
  data: state.documentRestrictions.data,
  error: state.documentRestrictions.error,
  isLoading: state.documentRestrictions.isLoading,
  hasError: state.documentRestrictions.hasError,
});

const mapDispatchToProps = dispatch => ({
  setRestrictionsOnDocument: (pid, accessList) =>
    dispatch(setRestrictionsOnDocument(pid, accessList)),
});

export const DocumentAccessRestrictions = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentAccessRestrictionsComponent);

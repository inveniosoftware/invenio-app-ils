import { connect } from 'react-redux';

import { rejectRequest } from '../../state/actions';
import DocumentRequestActionsComponent from './DocumentRequestActions';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  rejectRequest: (pid, data) => dispatch(rejectRequest(pid, data)),
});

export const DocumentRequestActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestActionsComponent);

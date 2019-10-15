import { connect } from 'react-redux';
import { reject } from '../../state/actions';
import RequestActionsComponent from './RequestActions';

const mapStateToProps = state => ({
  error: state.documentRequestDetails.error,
  documentRequestDetails: state.documentRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  reject: (pid, action, data) => dispatch(reject(pid, action, data)),
});

export const RequestActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestActionsComponent);

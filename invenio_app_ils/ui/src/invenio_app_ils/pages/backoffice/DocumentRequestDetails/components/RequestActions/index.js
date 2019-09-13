import { connect } from 'react-redux';
import { performCancelAction, performFulfillAction } from '../../state/actions';
import RequestActionsComponent from './RequestActions';

const mapStateToProps = state => ({
  error: state.documentRequestDetails.error,
  documentRequestDetails: state.documentRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  performCancelAction: (pid, cancelReason) =>
    dispatch(performCancelAction(pid, cancelReason)),
  performFulfillAction: (pid, documentPid) =>
    dispatch(performFulfillAction(pid, documentPid)),
});

export const RequestActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestActionsComponent);

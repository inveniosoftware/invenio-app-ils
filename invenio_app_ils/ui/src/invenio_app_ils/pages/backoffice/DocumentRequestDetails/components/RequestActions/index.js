import { connect } from 'react-redux';
import { performAction } from '../../state/actions';
import RequestActionsComponent from './RequestActions';

const mapStateToProps = state => ({
  error: state.documentRequestDetails.error,
  documentRequestDetails: state.documentRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  performAction: (pid, action, data) =>
    dispatch(performAction(pid, action, data)),
});

export const RequestActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestActionsComponent);

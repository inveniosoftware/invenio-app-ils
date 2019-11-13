import { connect } from 'react-redux';
import { sendOverdueLoansMailReminder } from './state/actions';
import OverdueLoanSendMailModalComponent from './OverdueLoanSendMailModal';

const mapStateToProps = state => ({
  ...state.overdueLoanSendMailModal,
});

const mapDispatchToProps = dispatch => ({
  sendOverdueLoansMailReminder: loanPid =>
    dispatch(sendOverdueLoansMailReminder(loanPid)),
});

export const OverdueLoanSendMailModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(OverdueLoanSendMailModalComponent);

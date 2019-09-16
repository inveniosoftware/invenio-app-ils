import { connect } from 'react-redux';
import { sendOverdueLoansMailReminder } from './state/actions';
import SendMailModalComponent from './SendMailModal';

const mapStateToProps = state => ({
  ...state.sendMailModal,
});

const mapDispatchToProps = dispatch => ({
  sendOverdueLoansMailReminder: loanPid =>
    dispatch(sendOverdueLoansMailReminder(loanPid)),
});

export const SendMailModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMailModalComponent);

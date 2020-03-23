import { connect } from 'react-redux';
import { performLoanAction } from '@pages/backoffice/Loan/LoanDetails/state/actions';
import ExtendButtonComponent from './ExtendButton';

const mapDispatchToProps = dispatch => ({
  extendLoan: (url, documentPid, patronPid, itemPid) =>
    dispatch(
      performLoanAction(url, documentPid, patronPid, { itemPid: itemPid })
    ),
});

export const ExtendButton = connect(
  null,
  mapDispatchToProps
)(ExtendButtonComponent);

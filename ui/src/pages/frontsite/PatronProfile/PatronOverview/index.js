import { connect } from 'react-redux';
import PatronOverviewComponent from './PatronOverview';

const mapStateToProps = state => ({
  currentLoans: state.patronCurrentLoans,
  loanRequests: state.patronPendingLoans,
  documentRequests: state.patronDocumentRequests,
});

export const PatronOverview = connect(
  mapStateToProps,
  null
)(PatronOverviewComponent);

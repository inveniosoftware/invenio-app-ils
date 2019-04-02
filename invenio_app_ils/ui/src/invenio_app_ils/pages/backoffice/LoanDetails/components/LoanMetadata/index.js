import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LoanMetadataComponent from './LoanMetadata';

const mapStateToProps = state => ({
  error: state.loanDetails.error,
  loanDetails: state.loanDetails.data,
});

export const LoanMetadata = compose(
  withRouter,
  connect(mapStateToProps)
)(LoanMetadataComponent);

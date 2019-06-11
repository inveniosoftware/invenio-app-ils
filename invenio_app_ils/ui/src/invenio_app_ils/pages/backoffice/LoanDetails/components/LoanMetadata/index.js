import { connect } from 'react-redux';

import LoanMetadataComponent from './LoanMetadata';

const mapStateToProps = state => ({
  error: state.loanDetails.error,
  loanDetails: state.loanDetails.data,
});

export const LoanMetadata = connect(mapStateToProps)(LoanMetadataComponent);

import { connect } from 'react-redux';

import CurrentItemComponent from './CurrentItem';

const mapStateToProps = state => ({
  error: state.loanDetails.error,
  loanDetails: state.loanDetails.data,
  isLoading: state.loanDetails.isLoading,
});

export const CurrentItem = connect(mapStateToProps)(CurrentItemComponent);

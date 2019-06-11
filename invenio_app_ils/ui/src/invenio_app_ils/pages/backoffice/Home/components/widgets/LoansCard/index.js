import { connect } from 'react-redux';
import { fetchPendingLoans } from './state/actions';
import LoansCardComponent from './LoansCard';

const mapStateToProps = state => ({
  data: state.loansCard.data,
  error: state.loansCard.error,
  isLoading: state.loansCard.isLoading,
  hasError: state.loansCard.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPendingLoans: () => dispatch(fetchPendingLoans()),
});

export const LoansCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoansCardComponent);

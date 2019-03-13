import { connect } from 'react-redux';
import { fetchPendingLoans } from './state/actions';
import LoansCardComponent from './LoansCard';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  data: state.loansCard.data,
  error: state.loansCard.error,
  isLoading: state.loansCard.isLoading,
  hasError: state.loansCard.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPendingLoans: () => dispatch(fetchPendingLoans()),
});

export const LoansCard = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoansCardComponent);

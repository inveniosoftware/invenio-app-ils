import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPendingLoans } from './state/actions';
import { DocumentPendingLoansContainer } from './DocumentPendingLoansContainer';

const mapStateToProps = state => ({
  ...state.documentPendingLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPendingLoans: documentPid => dispatch(fetchPendingLoans(documentPid)),
});

export const DocumentPendingLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentPendingLoansContainer);

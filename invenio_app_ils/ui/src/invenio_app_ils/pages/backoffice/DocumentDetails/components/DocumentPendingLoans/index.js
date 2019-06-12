import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withDataContainer } from '../../../../../common/components/DataContainer';
import { fetchPendingLoans } from './state/actions';
import DocumentPendingLoansComponent from './DocumentPendingLoans';

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
  ),
  withDataContainer(props =>
    props.fetchPendingLoans(props.match.params.documentPid)
  )
)(DocumentPendingLoansComponent);

import { connect } from 'react-redux';
import { fetchOverbookedDocuments } from './state/actions';
import OverbookedDocumentsListComponent from './OverbookedDocumentsList';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  data: state.overbookedDocuments.data,
  isLoading: state.overbookedDocuments.isLoading,
  hasError: state.overbookedDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchOverbookedDocuments: () => dispatch(fetchOverbookedDocuments()),
});

export const OverbookedDocumentsList = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OverbookedDocumentsListComponent);

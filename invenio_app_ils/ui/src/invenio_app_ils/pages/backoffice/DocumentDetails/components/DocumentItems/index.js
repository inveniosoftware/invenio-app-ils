import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchDocumentItems } from './state/actions';
import { DocumentItemsContainer } from './DocumentItemsContainer';

const mapStateToProps = state => ({
  ...state.documentItems,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentItems: documentPid => dispatch(fetchDocumentItems(documentPid)),
});

export const DocumentItems = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentItemsContainer);

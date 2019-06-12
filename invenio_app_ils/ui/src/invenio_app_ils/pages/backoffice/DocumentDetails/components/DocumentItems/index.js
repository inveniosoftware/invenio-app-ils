import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withDataContainer } from '../../../../../common/components/DataContainer';
import { fetchDocumentItems } from './state/actions';
import DocumentItemsComponent from './DocumentItems';

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
  ),
  withDataContainer(props =>
    props.fetchDocumentItems(props.match.params.documentPid)
  )
)(DocumentItemsComponent);

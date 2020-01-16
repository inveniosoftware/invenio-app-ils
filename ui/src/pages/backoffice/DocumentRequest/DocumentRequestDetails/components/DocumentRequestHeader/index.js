import { connect } from 'react-redux';

import DocumentRequestHeaderComponent from './DocumentRequestHeader';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

export const DocumentRequestHeader = connect(
  mapStateToProps,
  null
)(DocumentRequestHeaderComponent);

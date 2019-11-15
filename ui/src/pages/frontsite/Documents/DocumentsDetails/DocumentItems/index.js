import { connect } from 'react-redux';
import DocumentItemsComponent from './DocumentItems';

const mapStateToProps = state => ({
  documentDetails: state.documentDetailsFront.data,
});

export const DocumentItems = connect(
  mapStateToProps,
  null
)(DocumentItemsComponent);

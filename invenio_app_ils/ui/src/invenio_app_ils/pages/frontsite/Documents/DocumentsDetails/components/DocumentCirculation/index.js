import { connect } from 'react-redux';
import DocumentCirculationComponent from './DocumentCirculation';

const mapStateToProps = state => ({
  documentDetails: state.documentDetailsFront.data,
  isLoading: state.documentDetailsFront.isLoading,
});

export const DocumentCirculation = connect(
  mapStateToProps,
  null
)(DocumentCirculationComponent);

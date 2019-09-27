import { connect } from 'react-redux';
import DocumentCirculationComponent from './DocumentCirculation';

const mapStateToProps = state => ({
  documentsDetails: state.documentsDetails.data,
});

export const DocumentCirculation = connect(
  mapStateToProps,
  null
)(DocumentCirculationComponent);

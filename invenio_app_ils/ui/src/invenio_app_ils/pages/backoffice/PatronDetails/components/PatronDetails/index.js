import { connect } from 'react-redux';
import PatronDetailsComponent from './PatronDetails';

const mapStateToProps = state => ({
  isLoading: state.patronDetails.isLoading,
  data: state.patronDetails.data,
  error: state.patronDetails.error,
  hasError: state.patronDetails.hasError,
});

export const PatronDetails = connect(mapStateToProps)(PatronDetailsComponent);

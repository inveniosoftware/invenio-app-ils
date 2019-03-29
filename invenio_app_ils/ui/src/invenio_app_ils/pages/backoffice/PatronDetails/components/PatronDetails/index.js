import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PatronDetailsComponent from './PatronDetails';

const mapStateToProps = state => ({
  isLoading: state.patronDetails.isLoading,
  data: state.patronDetails.data,
  error: state.patronDetails.error,
  hasError: state.patronDetails.hasError,
});

export const PatronDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(PatronDetailsComponent);

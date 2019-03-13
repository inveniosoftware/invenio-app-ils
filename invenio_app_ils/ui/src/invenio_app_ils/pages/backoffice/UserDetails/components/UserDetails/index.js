import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserDetailsComponent from './UserDetails';

const mapStateToProps = state => ({
  isLoading: state.userDetails.isLoading,
  data: state.userDetails.data,
  error: state.userDetails.error,
  hasError: state.userDetails.hasError,
});

export const UserDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(UserDetailsComponent);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchUserDetails } from './state/actions';
import UserDetailsContainerComponent from './UserDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchUserDetails: userPid => dispatch(fetchUserDetails(userPid)),
});

export const UserDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(UserDetailsContainerComponent);

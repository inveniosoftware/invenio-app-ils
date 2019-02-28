import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchUserDetails } from './state/actions';

import SelectedUserComponent from './SelectedUser';

const mapDispatchToProps = dispatch => ({
  fetchUserDetails: userPid => dispatch(fetchUserDetails(userPid)),
});

const mapStateToProps = state => ({
  isLoading: state.selectedUser.isLoading,
  data: state.selectedUser.data,
  hasError: state.selectedUser.hasError,
});

export const SelectedUser = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SelectedUserComponent);

import { connect } from 'react-redux';
import PatronProfileComponent from './PatronProfile';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
});

export const PatronProfile = connect(mapStateToProps)(PatronProfileComponent);

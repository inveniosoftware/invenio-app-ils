import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserMetadataComponent from './UserMetadata';

const mapStateToProps = state => ({
  userDetails: state.userDetails,
});

export const UserMetadata = compose(
  withRouter,
  connect(mapStateToProps)
)(UserMetadataComponent);

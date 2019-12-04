import { connect } from 'react-redux';
import PatronMetadataComponent from './PatronMetadata';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
});

export const PatronMetadata = connect(mapStateToProps)(PatronMetadataComponent);

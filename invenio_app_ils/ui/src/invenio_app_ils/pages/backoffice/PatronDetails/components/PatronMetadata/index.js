import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PatronMetadataComponent from './PatronMetadata';

const mapStateToProps = state => ({
  patronDetails: state.patronDetails,
});

export const PatronMetadata = compose(
  withRouter,
  connect(mapStateToProps)
)(PatronMetadataComponent);

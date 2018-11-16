import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemMetadataComponent from './ItemMetadata';

const mapStateToProps = state => ({
  itemDetails: state.itemDetails.data,
});

export const ItemMetadata = compose(
  withRouter,
  connect(mapStateToProps)
)(ItemMetadataComponent);

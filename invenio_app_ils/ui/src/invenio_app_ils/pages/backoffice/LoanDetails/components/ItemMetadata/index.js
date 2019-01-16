import { connect } from 'react-redux';
import ItemMetadataComponent from './ItemMetadata';

const mapStateToProps = state => ({
  itemDetails: state.itemDetails.data,
});

export const ItemMetadata = connect(mapStateToProps)(ItemMetadataComponent);

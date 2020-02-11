import { connect } from 'react-redux';
import RelationLanguagesComponent from './RelationLanguages';
import RelationLanguagesModalComponent from './RelationLanguagesModal';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const RelationLanguages = connect(
  mapStateToProps,
  null
)(RelationLanguagesComponent);

export const RelationLanguagesModal = connect(
  mapStateToProps,
  null
)(RelationLanguagesModalComponent);

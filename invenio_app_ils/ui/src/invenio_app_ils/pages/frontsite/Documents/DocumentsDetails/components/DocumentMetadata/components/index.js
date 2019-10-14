import { connect } from 'react-redux';
import { DocumentTags as DocumentTagsComponent } from './DocumentTags';
import { DocumentRelations as DocumentRelationsComponent } from './DocumentRelations';
import { DocumentInfo as DocumentInfoComponent } from './DocumentInfo';
import { DocumentCover as DocumentCoverComponent } from './DocumentCover';
import { DocumentAbstract as DocumentAbstractComponent } from './DocumentAbstract';
import { DocumentAuthors as DocumentAuthorsComponent } from './DocumentAuthors';
import { DocumentTitle as DocumentTitleComponent } from './DocumentTitle';

const mapStateToProps = state => ({
  isLoading: state.documentDetailsFront.isLoading,
  metadata: state.documentDetailsFront.data.metadata,
  hasError: state.documentDetailsFront.hasError,
});

export const DocumentTags = connect(
  mapStateToProps,
  null
)(DocumentTagsComponent);

export const DocumentRelations = connect(
  mapStateToProps,
  null
)(DocumentRelationsComponent);

export const DocumentInfo = connect(
  mapStateToProps,
  null
)(DocumentInfoComponent);

export const DocumentCover = connect(
  mapStateToProps,
  null
)(DocumentCoverComponent);

export const DocumentAbstract = connect(
  mapStateToProps,
  null
)(DocumentAbstractComponent);

export const DocumentAuthors = connect(
  mapStateToProps,
  null
)(DocumentAuthorsComponent);

export const DocumentTitle = connect(
  mapStateToProps,
  null
)(DocumentTitleComponent);

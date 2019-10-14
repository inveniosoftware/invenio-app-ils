import { connect } from 'react-redux';
import { DocumentTags as DocumentTagsComponent } from './DocumentTags';
import { DocumentRelations as DocumentRelationsComponent } from './DocumentRelations';
import { DocumentInfo as DocumentInfoComponent } from './DocumentInfo';
import { DocumentCover as DocumentCoverComponent } from './DocumentCover';
import { DocumentAbstract as DocumentAbstractComponent } from './DocumentAbstract';
import { DocumentTitle as DocumentTitleComponent } from './DocumentTitle';
export { DocumentTableOfContent } from './DocumentTableOfContent';
export { DocumentConference } from './DocumentConference';

export { DocumentAuthors } from './DocumentAuthors';

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

export const DocumentTitle = connect(
  mapStateToProps,
  null
)(DocumentTitleComponent);

import { connect } from 'react-redux';
import { DocumentTags as DocumentTagsComponent } from '@components/Document';
import { DocumentRelations as DocumentRelationsComponent } from './DocumentRelations';
import { DocumentInfo as DocumentInfoComponent } from './DocumentInfo';
import { DocumentCover as DocumentCoverComponent } from './DocumentCover';
import { DocumentTitle as DocumentTitleComponent } from './DocumentTitle';
import { DocumentMetadataTabs as DocumentMetadataTabsComponent } from './DocumentMetadataTabs';
import { DocumentMetadataAccordion as DocumentMetadataAccordionComponent } from './DocumentMetadataAccordion';
import { showTab } from '@pages/frontsite/Documents/DocumentsDetails/state/actions';
export { DocumentStats } from './DocumentStats';
export { DownloadLink } from './DownloadLink';

const mapStateToProps = state => ({
  isLoading: state.documentDetailsFront.isLoading,
  metadata: state.documentDetailsFront.data.metadata,
  hasError: state.documentDetailsFront.hasError,
  activeTab: state.documentDetailsFront.activeTab,
});

const mapDispatchToProps = dispatch => ({
  showTab: activeIndex => dispatch(showTab(activeIndex)),
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

export const DocumentTitle = connect(
  mapStateToProps,
  null
)(DocumentTitleComponent);

export const DocumentMetadataTabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataTabsComponent);

export const DocumentMetadataAccordion = connect(
  mapStateToProps,
  null
)(DocumentMetadataAccordionComponent);

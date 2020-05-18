import { AuthenticationGuard } from '@authentication/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Icon, Responsive } from 'semantic-ui-react';
import { DocumentMetadata } from './DocumentMetadata';
import { goTo } from '@history';
import { FrontSiteRoutes, BackOfficeRoutes } from '@routes/urls';
import { SearchBar, Error, NotFound, Forbidden } from '@components';
import { DocumentPanel } from './DocumentPanel';
import { Breadcrumbs, DocumentTags } from '../../components';
import { ILSParagraphPlaceholder } from '@components/ILSPlaceholder';
import { DocumentItems } from './DocumentItems';
import { document as documentApi } from '@api/documents/document';
import isEmpty from 'lodash/isEmpty';

export default class DocumentsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
    this.renderElement = props.renderElement || this._renderElement;
  }

  componentDidMount() {
    this.fetchDocumentsDetails(this.props.match.params.documentPid);
  }

  componentDidUpdate(prevProps) {
    const documentPid = this.props.match.params.documentPid;
    const samePidFromRouter =
      prevProps.match.params.documentPid === documentPid;
    if (!samePidFromRouter) {
      this.fetchDocumentsDetails(documentPid);
    }
  }

  fetchDocumentsDetails(documentPid) {
    this.props.fetchDocumentsDetails(documentPid);

    this.documentViewed();
  }

  documentViewed = async () => {
    try {
      await documentApi.viewEvent(this.props.match.params.documentPid);
    } catch (error) {
      console.warn('Error sending record-view event', error);
    }
  };

  onSearchClick = () => {
    const query = encodeURIComponent(this.state.searchQuery);
    goTo(FrontSiteRoutes.documentsListWithQuery(query));
  };

  onSearchInputChange = (value, event) => {
    this.setState({ searchQuery: event.target.value });
  };

  breadcrumbs = () => [
    { to: FrontSiteRoutes.home, label: 'Home' },
    { to: FrontSiteRoutes.documentsList, label: 'Search' },
  ];

  render() {
    const { isLoading, hasError, error, documentDetails } = this.props;
    if (hasError) {
      if (error.response.status === 403) {
        return <Forbidden />;
      } else if (error.response.status === 404) {
        return <NotFound />;
      }
    }
    return (
      <>
        <Container fluid className="document-details-search-container">
          <Container>
            <SearchBar
              currentQueryString={this.state.searchQuery}
              onInputChange={this.onSearchInputChange}
              executeSearch={this.onSearchClick}
              placeholder={'Search for books...'}
              className="document-details-search-bar"
            />
          </Container>
        </Container>
        <Error boundary error={error}>
          <Container className="document-details-container default-margin-top">
            <Grid columns={2}>
              <Grid.Column width={13}>
                <ILSParagraphPlaceholder isLoading={isLoading} lines={1}>
                  <Breadcrumbs
                    isLoading={isLoading}
                    elements={this.breadcrumbs()}
                    currentElement={
                      documentDetails.metadata
                        ? documentDetails.metadata.title
                        : null
                    }
                  />
                </ILSParagraphPlaceholder>
              </Grid.Column>
              <Grid.Column width={3} textAlign="right">
                {!isEmpty(this.props.documentDetails.metadata) && (
                  <AuthenticationGuard
                    silent={true}
                    authorizedComponent={() => (
                      <Link
                        to={BackOfficeRoutes.documentDetailsFor(
                          this.props.documentDetails.metadata.pid
                        )}
                      >
                        open in backoffice <Icon name="cogs" />
                      </Link>
                    )}
                    roles={['admin', 'librarian']}
                    loginComponent={() => <></>}
                  />
                )}
              </Grid.Column>
            </Grid>
            <DocumentPanel />
          </Container>
          <Container className="document-tags spaced">
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                <DocumentTags />
              </ILSParagraphPlaceholder>
            </Responsive>
          </Container>
          <Container className="items-locations spaced">
            <ILSParagraphPlaceholder linesNumber={3} isLoading={isLoading}>
              <DocumentItems />
            </ILSParagraphPlaceholder>
          </Container>
          <Container className="section" fluid>
            <Container>
              <ILSParagraphPlaceholder linesNumber={20} isLoading={isLoading}>
                <DocumentMetadata />
              </ILSParagraphPlaceholder>
            </Container>
          </Container>
        </Error>
      </>
    );
  }
}

DocumentsDetails.propTypes = {
  fetchDocumentsDetails: PropTypes.func.isRequired,
  renderElement: PropTypes.node,
};

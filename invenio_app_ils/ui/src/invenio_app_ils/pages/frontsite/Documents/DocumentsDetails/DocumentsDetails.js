import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentMetadata } from './components';
import { goTo } from '../../../../history';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { SearchBar } from '../../../../common/components/SearchBar';
import { DocumentPanel } from './components/DocumentPanel';
import { Error } from '../../../../common/components/Error';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentTags } from './components/DocumentMetadata/components';
import { ILSParagraphPlaceholder } from '../../../../common/ILSPlaceholder';

export default class DocumentsDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentsDetails = this.props.fetchDocumentsDetails;
    this.state = { searchQuery: '' };
    this.renderElement = props.renderElement || this._renderElement;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentPid) {
        this.fetchDocumentsDetails(location.state.documentPid);
      }
    });
    this.fetchDocumentsDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

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

  _renderElement(isLoading, error) {
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

        <Error error={error}>
          <Container className="document-details-container default-margin-top">
            <ILSParagraphPlaceholder isLoading={isLoading} lines={1}>
              <Breadcrumbs
                isLoading={isLoading}
                elements={this.breadcrumbs()}
                currentElement={
                  this.props.documentDetails.metadata
                    ? this.props.documentDetails.metadata.title
                    : null
                }
              />
            </ILSParagraphPlaceholder>
            <DocumentPanel />
          </Container>
          <Container className="document-tags">
            <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
              <DocumentTags />
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

  render() {
    const { isLoading, error, data } = this.props;
    return this.renderElement(isLoading, error, data);
  }
}

DocumentsDetails.propTypes = {
  fetchDocumentsDetails: PropTypes.func.isRequired,
  renderElement: PropTypes.node,
};

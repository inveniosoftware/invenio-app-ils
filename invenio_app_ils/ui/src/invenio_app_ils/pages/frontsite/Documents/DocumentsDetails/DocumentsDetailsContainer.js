import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentMetadata } from './components';
import { goTo } from '../../../../history';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { SearchBar } from '../../../../common/components/SearchBar';
import { DocumentPanel } from './components/DocumentPanel';
import { Error } from '../../../../common/components/Error';
import { Loader } from '../../../../common/components/Loader';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentTags } from './components/DocumentMetadata/components';

export class DocumentDetails extends Component {
  breadcrumbs = () => [
    { to: FrontSiteRoutes.home, label: 'Home' },
    { to: FrontSiteRoutes.documentsList, label: 'Search' },
  ];

  render() {
    return (
      <>
        <Container className="document-details-container default-margin-top">
          <Breadcrumbs
            elements={this.breadcrumbs()}
            currentElement={this.props.data.metadata.title}
          />
          <DocumentPanel />
        </Container>
        <Container className="document-tags">
          <DocumentTags tags={this.props.data.metadata.tags} />
        </Container>
        <Container className="section" fluid>
          <Container>
            <DocumentMetadata />
          </Container>
        </Container>
      </>
    );
  }
}

export default class DocumentsDetailsContainer extends Component {
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

  _renderElement(isLoading, error, data) {
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

        <Loader isLoading={isLoading}>
          <Error error={error}>
            <DocumentDetails data={data} />
          </Error>
        </Loader>
      </>
    );
  }

  render() {
    const { isLoading, error, data } = this.props;
    return this.renderElement(isLoading, error, data);
  }
}

DocumentsDetailsContainer.propTypes = {
  fetchDocumentsDetails: PropTypes.func.isRequired,
  renderElement: PropTypes.node,
};

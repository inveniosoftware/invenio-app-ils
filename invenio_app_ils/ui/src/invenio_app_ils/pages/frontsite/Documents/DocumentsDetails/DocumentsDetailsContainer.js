import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Container } from 'semantic-ui-react';
import { DocumentMetadata } from './components';
import { goTo } from '../../../../history';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { SearchBar } from '../../../../common/components/SearchBar';
import { DocumentPanel } from './components/DocumentPanel';
import { Error } from '../../../../common/components/Error';
import { Loader } from '../../../../common/components/Loader';

export default class DocumentsDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentsDetails = this.props.fetchDocumentsDetails;
    this.state = { searchQuery: '' };
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
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

  onSearchInputChange(value, event) {
    this.setState({ searchQuery: event.target.value });
  }

  _renderElement(isLoading, error, data) {
    return (
      <Container>
        <SearchBar
          currentQueryString={this.state.searchQuery}
          onInputChange={this.onSearchInputChange}
          executeSearch={this.onSearchClick}
          placeholder={'Search for books...'}
        />
        <br />
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Breadcrumb>
              <Breadcrumb.Section link>Home</Breadcrumb.Section>
              <Breadcrumb.Divider icon="right chevron" />
              <Breadcrumb.Section link>Search</Breadcrumb.Section>
              <Breadcrumb.Divider icon="right arrow" />
              <Breadcrumb.Section active>
                {data.metadata ? data.metadata.title : null}
              </Breadcrumb.Section>
            </Breadcrumb>
            <br />
            <DocumentPanel />
            <DocumentMetadata />
          </Error>
        </Loader>
      </Container>
    );
  }

  render() {
    const { isLoading, error, data } = this.props;
    return this.renderElement(isLoading, error, data);
  }
}

DocumentsDetailsContainer.propTypes = {
  fetchDocumentsDetails: PropTypes.func.isRequired,
  renderElement: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Responsive } from 'semantic-ui-react';
import { Error, SearchBar } from '@components';
import { goTo } from '@history';
import { FrontSiteRoutes } from '@routes/urls';
import { ILSParagraphPlaceholder } from '@components/ILSPlaceholder';
import { Breadcrumbs } from '@pages/frontsite/components';
import { SeriesPanel } from './SeriesPanel';
import { SeriesLiteratureSearch } from '@pages/frontsite/components/Series';
import { SeriesMetadata } from './SeriesMetadata';

export default class SeriesDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.seriesPid) {
        this.props.fetchSeriesDetails(location.state.seriesPid);
      }
    });
    this.props.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  breadcrumbs = () => [
    { to: FrontSiteRoutes.home, label: 'Home' },
    { to: FrontSiteRoutes.documentsList, label: 'Search' },
  ];

  onSearchClick = () => {
    const query = encodeURIComponent(this.state.searchQuery);
    goTo(FrontSiteRoutes.documentsListWithQuery(query));
  };

  onSearchInputChange = (value, event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    const { error, isLoading, series } = this.props;
    return (
      <>
        <Container fluid className="document-details-search-container">
          <Container>
            <SearchBar
              currentQueryString={this.state.searchQuery}
              onInputChange={this.onSearchInputChange}
              executeSearch={this.onSearchClick}
              placeholder="Search for books..."
              className="document-details-search-bar"
            />
          </Container>
        </Container>
        <Error boundary error={error}>
          <Container className="document-details-container default-margin-top">
            <ILSParagraphPlaceholder isLoading={isLoading} lines={1}>
              <Breadcrumbs
                isLoading={isLoading}
                elements={this.breadcrumbs()}
                currentElement={series.metadata ? series.metadata.title : null}
              />
            </ILSParagraphPlaceholder>
            <SeriesPanel />
          </Container>
          <Responsive minWidth={Responsive.onlyComputer.minWidth}>
            <Container className="items-locations spaced">
              <ILSParagraphPlaceholder linesNumber={3} isLoading={isLoading}>
                <SeriesLiteratureSearch metadata={series.metadata} />
              </ILSParagraphPlaceholder>
            </Container>
          </Responsive>
          <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
            <ILSParagraphPlaceholder linesNumber={3} isLoading={isLoading}>
              <SeriesLiteratureSearch metadata={series.metadata} />
            </ILSParagraphPlaceholder>
          </Responsive>
          <Container className="section" fluid>
            <Container>
              <ILSParagraphPlaceholder linesNumber={20} isLoading={isLoading}>
                <SeriesMetadata />
              </ILSParagraphPlaceholder>
            </Container>
          </Container>
        </Error>
      </>
    );
  }
}

SeriesDetails.propTypes = {
  series: PropTypes.object.isRequired,
};

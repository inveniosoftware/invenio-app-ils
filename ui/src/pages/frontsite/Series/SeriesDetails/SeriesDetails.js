import { AuthenticationGuard } from '@authentication/components';
import { Error, SearchBar } from '@components';
import { ILSParagraphPlaceholder } from '@components/ILSPlaceholder';
import { goTo } from '@history';
import { Breadcrumbs } from '@pages/frontsite/components';
import { SeriesLiteratureSearch } from '@pages/frontsite/components/Series';
import { BackOfficeRoutes, FrontSiteRoutes } from '@routes/urls';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Icon, Responsive } from 'semantic-ui-react';
import { SeriesMetadata } from './SeriesMetadata';
import { SeriesPanel } from './SeriesPanel';

export default class SeriesDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  componentDidUpdate(prevProps) {
    const seriesPid = this.props.match.params.seriesPid;
    const samePidFromRouter = prevProps.match.params.seriesPid === seriesPid;
    if (!samePidFromRouter) {
      this.fetchSeriesDetails(seriesPid);
    }
  }

  fetchSeriesDetails(seriesPid) {
    this.props.fetchSeriesDetails(seriesPid);
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
              <Grid columns={2}>
                <Grid.Column width={13}>
                  <Breadcrumbs
                    isLoading={isLoading}
                    elements={this.breadcrumbs()}
                    currentElement={
                      series.metadata ? series.metadata.title : null
                    }
                  />
                </Grid.Column>
                <Grid.Column width={3} textAlign="right">
                  {!isEmpty(series.metadata) && (
                    <AuthenticationGuard
                      silent={true}
                      authorizedComponent={() => (
                        <Link
                          to={BackOfficeRoutes.seriesDetailsFor(
                            series.metadata.pid
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

import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { FrontSiteRoutes } from '../../../routes/urls';
import { goTo } from '../../../history';
import { SearchBar } from '../../../common/components/SearchBar';
import { document as documentApi } from '../../../common/api';
import { BookGroup } from './components/BookGroup';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  updateSearchQuery = (value, event) => {
    this.setState({ query: event.target.value });
  };

  onSearchExecute = () => {
    const query = encodeURIComponent(this.state.query);
    goTo(FrontSiteRoutes.documentsListWithQuery(query));
  };

  render() {
    return (
      <Grid>
        <Grid.Row centered columns={1}>
          <Header size="huge">CERN Library</Header>
          <SearchBar
            currentQueryString={this.state.searchQuery}
            onInputChange={this.updateSearchQuery}
            executeSearch={this.onSearchExecute}
            placeholder={'Search for books...'}
          />
        </Grid.Row>

        <Grid.Row centered columns={1}>
          <BookGroup
            title={'Most Loaned Books'}
            fetchDataMethod={documentApi.list}
            fetchDataQuery={documentApi
              .query()
              .withDocumentType('BOOK')
              .sortBy('-mostloaned')
              .qs()}
            viewAllUrl={FrontSiteRoutes.documentsListWithQuery(
              '&sort=mostloaned&order=desc'
            )}
          />
        </Grid.Row>

        <Grid.Row centered columns={1}>
          <BookGroup
            title={'Most Recent Books'}
            fetchDataMethod={documentApi.list}
            fetchDataQuery={documentApi
              .query()
              .withDocumentType('BOOK')
              .sortBy('mostrecent')
              .qs()}
            viewAllUrl={FrontSiteRoutes.documentsListWithQuery(
              '&sort=mostrecent&order=desc'
            )}
          />
        </Grid.Row>

        <Grid.Row centered columns={1}>
          <BookGroup
            title={'Most Recent E-Books'}
            fetchDataMethod={documentApi.list}
            fetchDataQuery={documentApi
              .query()
              .withDocumentType('BOOK')
              .withEitems()
              .sortBy('-mostrecent')
              .qs()}
            viewAllUrl={FrontSiteRoutes.documentsListWithQuery(
              'document_type:BOOK&sort=mostrecent&order=desc' +
                '&aggr[0][has_eitems][value]=has_eitems.electronic versions'
            )}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

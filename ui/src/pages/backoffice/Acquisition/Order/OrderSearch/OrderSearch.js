import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import {
  Error,
  ResultsList,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as OrdersSearchBar,
  SearchControls,
} from '@components';
import { acqOrder as orderApi } from '@api';
import { AcquisitionRoutes } from '@routes/urls';
import { ExportReactSearchKitResults, NewButton } from '../../../components';
import {
  SearchFooter,
  SearchEmptyResults,
  SearchAggregationsCards,
} from '@components/SearchControls/components/';
import history from '@history';
import { OrderList } from './OrderList';

class OrderResponseSerializer {
  serialize(results) {
    const hits = results.hits.hits.map(hit =>
      orderApi.serializer.fromJSON(hit)
    );
    return {
      aggregations: results.aggregations || {},
      hits: hits,
      total: results.hits.total,
    };
  }
}

export class OrderSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: orderApi.searchBaseURL,
      withCredentials: true,
    },
    invenio: {
      responseSerializer: OrderResponseSerializer,
    },
  });

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'vendor',
        field: 'vendor.name',
        defaultValue: '"Dolor"',
      },
      {
        name: 'recipient',
        field: 'order_lines.recipient',
        defaultValue: 'PATRON',
      },
      {
        name: 'patron id',
        field: 'order_lines.patron_pid',
        defaultValue: '1',
      },
    ];
    return (
      <OrdersSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for orders'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return <NewButton text={'Add order'} to={AcquisitionRoutes.orderCreate} />;
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderOrderList = results => {
    return <OrderList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Purchase Orders</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Container fluid className="bo-search-body">
            <Grid>
              <Grid.Row columns={2}>
                <ResultsLoader>
                  <Grid.Column width={3} className={'search-aggregations'}>
                    <Header content={'Filter by'} />
                    <SearchAggregationsCards modelName={'acqOrders'} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <Grid columns={2}>
                      <Grid.Column width={8}>
                        <NewButton
                          text={'Add order'}
                          to={AcquisitionRoutes.orderCreate}
                        />
                      </Grid.Column>
                      <Grid.Column width={8} textAlign={'right'}>
                        <ExportReactSearchKitResults
                          exportBaseUrl={orderApi.searchBaseURL}
                        />
                      </Grid.Column>
                    </Grid>
                    <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                    <Error renderElement={this.renderError} />
                    <SearchControls
                      modelName={'acqOrders'}
                      withLayoutSwitcher={false}
                    />
                    <ResultsList renderElement={this.renderOrderList} />
                    <SearchFooter />
                  </Grid.Column>
                </ResultsLoader>
              </Grid.Row>
            </Grid>
          </Container>
        </ReactSearchKit>
      </>
    );
  }
}

import React, { Component } from 'react';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Responsive,
  Accordion,
  Menu,
} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  Count,
  Aggregator,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '../../../common/config';
import { FrontSiteRoutes } from '../../../routes/urls';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
  ResultsSort,
} from '../../../common/components';
import { document as documentApi } from '../../../common/api';
import { ResultsList as RecordsResultsList } from './components';
import { goTo } from '../../../history';
import './DocumentsSearch.scss';

export class DocumentsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.url,
    withCredentials: true,
  });
  state = { activeIndex: 0 };
  searchConfig = getSearchConfig('documents');

  toggleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  renderAccordionAggregations = (
    title,
    resultsAggregations,
    aggregations,
    customProps
  ) => {
    const { activeIndex } = this.state;

    return resultsAggregations !== undefined ? (
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            content={title}
            index={customProps.index}
            active={activeIndex === customProps.index}
            onClick={this.toggleAccordion}
          />
          <Accordion.Content
            active={activeIndex === customProps.index}
            content={aggregations}
          />
        </Menu.Item>
      </Accordion>
    ) : null;
  };

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for records...'}
      />
    );
  };

  renderResultsList = results => {
    return (
      <div className="results-list">
        <RecordsResultsList
          results={results}
          viewDetailsClickHandler={pid =>
            goTo(FrontSiteRoutes.documentDetailsFor(pid))
          }
        />
      </div>
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No records found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
      </Segment>
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  renderAggregations = () => {
    const accordionPanels = this.searchConfig.AGGREGATIONS.map((agg, idx) => (
      <div className="aggregator" key={agg.field}>
        <Aggregator
          title={agg.title}
          field={agg.field}
          customProps={{ index: idx }}
          renderElement={this.renderAccordionAggregations}
        />
      </div>
    ));

    const cardPanels = this.searchConfig.AGGREGATIONS.map(agg => (
      <div className="aggregator" key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>{accordionPanels}</Responsive>
        <Responsive {...Responsive.onlyComputer}>{cardPanels}</Responsive>
      </div>
    );
  };

  renderHeader = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} textAlign="left">
          <Count renderElement={this.renderCount} />
        </Grid.Column>
        <Grid.Column width={6}>
          <Pagination />
        </Grid.Column>
        <Grid.Column width={5} textAlign="right">
          <ResultsSort searchConfig={this.searchConfig} />
        </Grid.Column>
      </Grid>
    );
  };

  renderFooter = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} />
        <Grid.Column width={6}>
          <Pagination />
        </Grid.Column>
        <Grid.Column width={5} />
      </Grid>
    );
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Container className="documents-search-searchbar">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>

        <Grid
          columns={2}
          stackable
          relaxed
          className="documents-search-container"
        >
          <Grid.Column width={3}>{this.renderAggregations()}</Grid.Column>
          <Grid.Column width={13}>
            <ResultsLoader>
              <EmptyResults renderElement={this.renderEmptyResults} />
              <Error renderElement={this.renderError} />
              {this.renderHeader()}
              <ResultsList renderElement={this.renderResultsList} />
              {this.renderFooter()}
            </ResultsLoader>
          </Grid.Column>
        </Grid>
      </ReactSearchKit>
    );
  }
}

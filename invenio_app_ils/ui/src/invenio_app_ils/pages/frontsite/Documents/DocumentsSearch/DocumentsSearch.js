import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Responsive,
  Accordion,
  Menu,
  Message,
  Item,
} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsGrid,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  Aggregator,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '../../../../common/config';
import { FrontSiteRoutes } from '../../../../routes/urls';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
} from '../../../../common/components';
import { document as documentApi } from '../../../../common/api';
import { DocumentListEntry } from './components';
import { BookCard } from '../../components';
import { goTo } from '../../../../history';
import { SearchControls } from '../../../../common/components';
import Qs from 'qs';

class SearchAggregations extends Component {
  state = { activeIndex: 0 };

  constructor(props) {
    super(props);
    this.searchConfig = props.searchConfig;
  }

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

  render() {
    const accordionPanels = this.searchConfig.AGGREGATIONS.map((agg, idx) => (
      <Aggregator
        title={agg.title}
        field={agg.field}
        key={agg.field}
        customProps={{ index: idx }}
        renderElement={this.renderAccordionAggregations}
      />
    ));

    const cardPanels = this.searchConfig.AGGREGATIONS.map(agg => (
      <Aggregator key={agg.field} title={agg.title} field={agg.field} />
    ));

    return (
      <>
        <Responsive {...Responsive.onlyMobile}>{accordionPanels}</Responsive>
        <Responsive {...Responsive.onlyComputer}>{cardPanels}</Responsive>
      </>
    );
  }
}

SearchAggregations.propTypes = {
  searchConfig: PropTypes.object.isRequired,
};

export class DocumentsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('documents');
  state = { activeIndex: 0, isLayoutGrid: true };

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

  renderResultsLayoutOptions = () => {
    const toggleLayout = () => {
      this.setState({ isLayoutGrid: !this.state.isLayoutGrid });
    };
    return (
      <Button.Group basic icon className={'search-layout-toggle'}>
        <Button disabled={this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="grid layout" />
        </Button>
        <Button disabled={!this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="list layout" />
        </Button>
      </Button.Group>
    );
  };

  renderResultsGrid = results => {
    const cards = results.map(book => {
      return <BookCard key={book.metadata.pid} data={book} />;
    });
    return (
      <Card.Group doubling stackable itemsPerRow={5}>
        {cards}
      </Card.Group>
    );
  };

  renderResultsList = results => {
    return results.length ? (
      <Item.Group>
        {results.map(book => (
          <DocumentListEntry
            key={book.metadata.pid}
            data-test={book.metadata.pid}
            metadata={book.metadata}
            rowActionClickHandler={pid =>
              goTo(FrontSiteRoutes.documentDetailsFor(pid))
            }
          />
        ))}
      </Item.Group>
    ) : null;
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

  renderFooter = () => {
    return (
      <Grid
        columns={3}
        textAlign={'center'}
        className={'search-footer-pagination'}
      >
        <Grid.Column />
        <Grid.Column>
          <Pagination />
        </Grid.Column>
        <Grid.Column />
      </Grid>
    );
  };

  onClickBookRequestLink = () => {
    const params = Qs.parse(window.location.search);
    const queryString = params['?q'];
    return {
      pathname: FrontSiteRoutes.documentRequestForm,
      state: { queryString },
    };
  };

  renderMessage = () => {
    const requestFormLink = (
      <Link to={this.onClickBookRequestLink()}>request form</Link>
    );
    return (
      <Message icon color="yellow">
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>
            Couldn't find the book you were looking for?
          </Message.Header>
          Please fill in the {requestFormLink} to request a new book from the
          library.
        </Message.Content>
      </Message>
    );
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Container fluid className="document-details-search-container">
          <Container>
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
        </Container>

        <Container fluid className="search-body">
          <Grid columns={2} stackable relaxed className="grid-documents-search">
            <ResultsLoader>
              <Grid.Column width={3} className="search-aggregations">
                <Header content={'Filter by'} />
                <SearchAggregations searchConfig={this.searchConfig} />
              </Grid.Column>
              <Grid.Column width={13} className="search-results">
                <EmptyResults renderElement={this.renderEmptyResults} />
                <Error renderElement={this.renderError} />
                <SearchControls
                  searchConfig={this.searchConfig}
                  layoutToggle={this.renderResultsLayoutOptions}
                />
                {this.state.isLayoutGrid ? (
                  <ResultsGrid renderElement={this.renderResultsGrid} />
                ) : (
                  <ResultsList renderElement={this.renderResultsList} />
                )}
                <Container fluid className={'search-results-footer'}>
                  {this.renderFooter()}
                  <Container className={'search-results-message'}>
                    {this.renderMessage()}
                  </Container>
                </Container>
              </Grid.Column>
            </ResultsLoader>
          </Grid>
        </Container>
      </ReactSearchKit>
    );
  }
}

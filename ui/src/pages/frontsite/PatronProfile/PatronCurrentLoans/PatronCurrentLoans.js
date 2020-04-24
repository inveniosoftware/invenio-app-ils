import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, Pagination } from '@components';
import { Container, Header, Item } from 'semantic-ui-react';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { NoResultsMessage } from '../../components/NoResultsMessage';
import { LoanListEntry } from './components';
import _isEmpty from 'lodash/isEmpty';

const PAGE_SIZE = 5;

export default class PatronCurrentLoans extends Component {
  constructor(props) {
    super(props);
    this.extendLoan = this.props.extendLoan;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.props.fetchPatronCurrentLoans(this.patronPid, {
      page: this.state.activePage,
      size: PAGE_SIZE,
    });
  }

  onPageChange = activePage => {
    this.props.fetchPatronCurrentLoans(this.patronPid, {
      page: activePage,
      size: PAGE_SIZE,
    });
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={PAGE_SIZE}
        loading={this.props.isLoading}
        onPageChange={this.onPageChange}
        totalResults={this.props.data.total}
      />
    );
  };

  renderList(data) {
    if (!_isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>
            {data.hits.map(entry => (
              <LoanListEntry
                key={entry.metadata.pid}
                loan={entry}
                extendLoan={this.extendLoan}
                onExtendSuccess={() => {
                  this.props.fetchPatronCurrentLoans(this.patronPid, {
                    page: this.state.activePage,
                    size: PAGE_SIZE,
                  });
                }}
              />
            ))}
          </Item.Group>
          <Container textAlign={'center'}>
            {this.paginationComponent()}
          </Container>
        </>
      );
    }
    return (
      <NoResultsMessage
        messageHeader={'No ongoing loans'}
        messageContent={'You do not currently have any ongoing loan.'}
      />
    );
  }

  renderLoader = props => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props} />
          <ILSItemPlaceholder fluid {...props} />
        </Item.Group>
      </>
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container className={'spaced'}>
        <Header
          as={'h2'}
          content={'Your current loans'}
          className={'highlight'}
          textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>{this.renderList(data)}</Error>
        </Loader>
      </Container>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

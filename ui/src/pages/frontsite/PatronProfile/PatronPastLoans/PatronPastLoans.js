import { toShortDate } from '@api/date';
import { Error, LiteratureCover, Loader, Pagination } from '@components';
import { DocumentAuthors } from '@components/Document';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { ExtensionCount } from '@pages/frontsite/components/Loan';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Item, Label } from 'semantic-ui-react';
import { NoResultsMessage } from '../../components/NoResultsMessage';

class PastLoanListEntry extends Component {
  render() {
    const { loan } = this.props;
    return (
      <Item key={loan.metadata.pid}>
        <LiteratureCover
          asItem={true}
          isRestricted={_get(loan, 'metadata.document.restricted', false)}
          linkTo={FrontSiteRoutes.documentDetailsFor(
            loan.metadata.document_pid
          )}
          size="tiny"
          url={_get(loan, 'metadata.document.cover_metadata.urls.medium')}
        />

        <Item.Content>
          <Item.Header
            as={Link}
            to={FrontSiteRoutes.documentDetailsFor(loan.metadata.document_pid)}
          >
            {loan.metadata.document.title}
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Item.Meta>
                <DocumentAuthors
                  metadata={loan.metadata.document}
                  authorsLimit={10}
                />
                Loaned on {toShortDate(loan.metadata.start_date)}
              </Item.Meta>
              <ExtensionCount count={loan.metadata.extension_count} />
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              mobile={16}
              tablet={8}
              computer={8}
            >
              <Item.Description>
                Literature returned on{' '}
                <Label>{toShortDate(loan.metadata.end_date)}</Label>
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

export default class PatronPastLoans extends Component {
  constructor(props) {
    super(props);
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.props.fetchPatronPastLoans(this.patronPid);
  }

  onPageChange = activePage => {
    this.props.fetchPatronPastLoans(this.patronPid, { page: activePage });
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        loading={this.props.isLoading}
        totalResults={this.props.data.total}
        onPageChange={this.onPageChange}
      />
    );
  };

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

  renderList = data => {
    if (!isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>
            {data.hits.map(entry => (
              <PastLoanListEntry key={entry.metadata.pid} loan={entry} />
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
        messageHeader={'No past loans'}
        messageContent={'You do not have any past loan.'}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container className={'spaced'}>
        <Header
          as={'h2'}
          content={'Your past loans'}
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

PatronPastLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

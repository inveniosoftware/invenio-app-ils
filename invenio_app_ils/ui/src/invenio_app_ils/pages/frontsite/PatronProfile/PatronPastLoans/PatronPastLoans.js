import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, Pagination } from '../../../../common/components';
import { toShortDate } from '../../../../common/api/date';
import { invenioConfig } from '../../../../common/config';
import { Container, Grid, Header, Item, Label } from 'semantic-ui-react';
import { getCover } from '../../config';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { DocumentAuthors } from '../../../../common/components/Document';
import { ILSItemPlaceholder } from '../../../../common/components/ILSPlaceholder/ILSPlaceholder';
import isEmpty from 'lodash/isEmpty';
import { NoResultsMessage } from '../../components/NoResultsMessage';

class PastLoanListEntry extends Component {
  render() {
    const { loan } = this.props;
    return (
      <Item key={loan.metadata.pid}>
        <Item.Image
          size="mini"
          src={getCover(loan.metadata.document_pid)}
          as={Link}
          disabled
          to={FrontSiteRoutes.documentDetailsFor(loan.metadata.document_pid)}
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
                <DocumentAuthors metadata={loan.metadata.document} />
                Loaned on {toShortDate(loan.metadata.start_date)}
              </Item.Meta>
              <Item.Description>
                {}
                You have extended this loan {
                  loan.metadata.extension_count
                } of {invenioConfig.loans.maxExtensionsCount} times
              </Item.Description>
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
    this.fetchPatronPastLoans = this.props.fetchPatronPastLoans;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.fetchPatronPastLoans(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronPastLoans(this.patronPid, activePage);
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={invenioConfig.defaultResultsSize}
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
        messageContent={'Currently you do not have any past loans'}
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

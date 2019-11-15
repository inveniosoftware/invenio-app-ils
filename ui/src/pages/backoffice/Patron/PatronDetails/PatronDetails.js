import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import {
  ItemsCheckout,
  ItemsSearch,
  PatronCurrentLoans,
  PatronDocumentRequests,
  PatronMetadata,
  PatronPendingLoans,
} from './components';

export default class PatronDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronDetails = this.props.fetchPatronDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.patronPid) {
        this.fetchPatronDetails(location.state.patronPid);
      }
    });
    this.fetchPatronDetails(this.props.match.params.patronPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Column width={5}>
            <Header as="h2">Patron's profile</Header>
          </Grid.Column>
          <Grid.Column width={11} />
        </Grid>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <PatronMetadata />
                  <ItemsCheckout />
                  <ItemsSearch />
                </Grid.Column>

                <Grid.Column>
                  <PatronCurrentLoans />
                  <PatronPendingLoans />
                  <PatronDocumentRequests />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Error>
        </Loader>
      </Container>
    );
  }
}

PatronDetails.propTypes = {
  fetchPatronDetails: PropTypes.func.isRequired,
};

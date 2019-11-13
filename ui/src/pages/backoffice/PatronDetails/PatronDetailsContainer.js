import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header } from 'semantic-ui-react';
import { PatronDetails } from './components';

export default class PatronDetailsContainer extends Component {
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
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Column width={5}>
            <Header as="h2">Patron's profile</Header>
          </Grid.Column>
          <Grid.Column width={11} />
        </Grid>
        <PatronDetails />
      </Container>
    );
  }
}

PatronDetailsContainer.propTypes = {
  fetchPatronDetails: PropTypes.func.isRequired,
};

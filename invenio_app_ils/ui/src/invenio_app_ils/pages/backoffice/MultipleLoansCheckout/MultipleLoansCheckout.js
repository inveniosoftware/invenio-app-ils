import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import { SelectedUser } from './components';
import { ItemsSearch } from './components';
import { ItemsBasket } from './components';
import { CheckoutSummary } from './components';

export default class MultipleLoansCheckout extends Component {
  render() {
    return (
      <Container>
        <Header as="h1">Multiple loans checkout</Header>
        <Grid columns={2}>
          <Grid.Column width={11}>
            <SelectedUser />
            <ItemsSearch />
          </Grid.Column>
          <Grid.Column width={5}>
            <ItemsBasket />
            <CheckoutSummary />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

MultipleLoansCheckout.propTypes = {};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import {
  Grid,
  Segment,
  Header,
  Table,
  Message,
  Divider,
  Button,
  Icon,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

export default class ItemsBasket extends Component {
  constructor(props) {
    super(props);
    this.basketCheckout = this.props.basketCheckout;
    this.removeItemFromBasket = this.props.removeItemFromBasket;
  }

  _renderItems = items => {
    let itemsList = [];
    for (let i = 0; i < items.length; i++) {
      itemsList.push(
        <Table.Row key={items[i].item_pid}>
          <Table.Cell>{i + 1}</Table.Cell>
          <Table.Cell>{items[i].barcode}</Table.Cell>
          <Table.Cell textAlign={'right'}>
            <Button
              icon
              onClick={() => {
                this.removeItemFromBasket(items[i]);
              }}
            >
              <Icon name={'minus circle'} />
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    }
    return itemsList;
  };

  _renderEmpty = () => {
    return <Message color="blue">No items in the basket.</Message>;
  };

  _renderBasket = basketItems => {
    return (
      <Table striped size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3} />
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this._renderItems(basketItems)}</Table.Body>
      </Table>
    );
  };

  _renderFooter = basketItems => {
    return (
      <Grid columns={2}>
        <Grid.Column width={8} />
        <Grid.Column width={8}>
          {basketItems.length === 0 ? (
            <Button icon disabled labelPosition={'left'} color={'green'} fluid>
              <Icon name={'book'} />
              Checkout
            </Button>
          ) : (
            <Button
              icon
              labelPosition={'left'}
              color={'green'}
              fluid
              onClick={() => {
                this._checkoutBasket();
              }}
            >
              <Icon name={'book'} />
              Checkout
            </Button>
          )}
        </Grid.Column>
      </Grid>
    );
  };

  _checkoutBasket = () => {
    const { patron, basketItems } = this.props;
    this.basketCheckout(patron, basketItems);
  };

  render() {
    const { isLoading, hasError, basketItems, data } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <Segment>
            <Header as="h3">Checkout basket</Header>
            {!_isEmpty(basketItems) && _isEmpty(data)
              ? this._renderBasket(basketItems)
              : this._renderEmpty()}
            <Divider />
            {this._renderFooter(basketItems)}
          </Segment>
        </Error>
      </Loader>
    );
  }
}

ItemsBasket.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  basketItems: PropTypes.array.isRequired,
  basketCheckout: PropTypes.func.isRequired,
  patron: PropTypes.object.isRequired,
  removeItemFromBasket: PropTypes.func.isRequired,
};

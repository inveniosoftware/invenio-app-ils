import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Item } from 'semantic-ui-react';
import OrderListEntry from './OrderListEntry';

export default class OrderList extends Component {
  renderListEntry = order => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(order);
    }
    return <OrderListEntry key={order.metadata.pid} order={order} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length)
      return <Message data-test="no-results">There are no orders.</Message>;

    return (
      <Item.Group divided className="bo-document-search">
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

OrderList.propTypes = {
  hits: PropTypes.array.isRequired,
  renderListEntryElement: PropTypes.func,
};

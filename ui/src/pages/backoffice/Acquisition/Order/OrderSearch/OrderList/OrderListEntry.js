import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Item, List } from 'semantic-ui-react';
import { AcquisitionRoutes, BackOfficeRoutes } from '@routes/urls';
import { toShortDateTime } from '@api/date';
import { formatPrice } from '@api/utils';
import { invenioConfig } from '@config';
import { getDisplayVal } from '@config/invenioConfig';
import { AcquisitionOrderIcon } from '@pages/backoffice/components/icons';

export default class OrderListEntry extends Component {
  renderLeftColumn = order => {
    return (
      <>
        <Item.Description>
          <Item.Meta>
            Ordered: {toShortDateTime(order.metadata.order_date)}
          </Item.Meta>
        </Item.Description>
        <Item.Description>
          <label>status </label>
          {getDisplayVal('acqOrders.statuses', order.metadata.status)}
        </Item.Description>
        <Item.Description>
          <label>vendor </label>
          <Link
            to={AcquisitionRoutes.vendorDetailsFor(order.metadata.vendor_pid)}
          >
            {order.metadata.vendor.name}
          </Link>
        </Item.Description>
        <Item.Description>
          <label>total </label>
          {formatPrice(order.metadata.grand_total_main_currency)}
          {order.metadata.grand_total.currency !==
          order.metadata.grand_total_main_currency.currency
            ? ` (${formatPrice(order.metadata.grand_total)})`
            : ''}
        </Item.Description>
      </>
    );
  };

  renderOrderLine = (orderLine, index) => {
    const documentPid = orderLine.document_pid;
    const patronPid = orderLine.patron_pid;
    const medium = orderLine.medium;
    const documentLink = (
      <Link to={BackOfficeRoutes.documentDetailsFor(documentPid)}>
        <code>{documentPid}</code>
      </Link>
    );
    const totalPrice = formatPrice(orderLine.total_price);
    return (
      <List.Item
        as="li"
        key={documentPid}
        value={`${orderLine.copies_ordered}x`}
      >
        {documentLink} - {medium}
        {patronPid && (
          <>
            {' '}
            - Patron{' '}
            <Link to={BackOfficeRoutes.patronDetailsFor(patronPid)}>
              <code>{patronPid}</code>
            </Link>
          </>
        )}{' '}
        - <em>{totalPrice}</em>
      </List.Item>
    );
  };

  renderMiddleColumn = order => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(order);
    }
    const showMax = invenioConfig.acqOrders.maxShowOrderLines;
    const orderLines = order.metadata.order_lines;
    return (
      <List as="ol">
        {orderLines
          .slice(0, showMax)
          .map((ol, index) => this.renderOrderLine(ol, index))}
        {orderLines.length > showMax && (
          <List.Item as="li" value="...">
            of {orderLines.length} order lines
          </List.Item>
        )}
      </List>
    );
  };

  renderRightColumn = order => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(order);
    }
    const { received_date, expected_delivery_date, payment } = order.metadata;
    return (
      <List verticalAlign="middle" className={'document-circulation'}>
        <List.Item>
          <List.Content floated="right">
            <strong>{payment.mode}</strong>
          </List.Content>
          <List.Content>payment mode</List.Content>
        </List.Item>
        {received_date && (
          <List.Item>
            <List.Content floated="right">
              <strong>{toShortDateTime(received_date)}</strong>
            </List.Content>
            <List.Content>received</List.Content>
          </List.Item>
        )}
        {expected_delivery_date && (
          <List.Item>
            <List.Content floated="right">
              <strong>{toShortDateTime(expected_delivery_date)}</strong>
            </List.Content>
            <List.Content>expected</List.Content>
          </List.Item>
        )}
      </List>
    );
  };

  render() {
    const { order } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={AcquisitionRoutes.orderDetailsFor(order.metadata.pid)}
            data-test={`navigate-${order.metadata.pid}`}
          >
            <AcquisitionOrderIcon />
            Order: {order.metadata.pid}
          </Item.Header>
          <Grid highlight={3}>
            <Grid.Column computer={5} largeScreen={5}>
              {this.renderLeftColumn(order)}
            </Grid.Column>
            <Grid.Column computer={6} largeScreen={6}>
              {this.renderMiddleColumn(order)}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column computer={3} largeScreen={3}>
              {this.renderRightColumn(order)}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className={'pid-field'}>#{order.metadata.pid}</div>
      </Item>
    );
  }
}

OrderListEntry.propTypes = {
  order: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};

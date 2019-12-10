import React from 'react';
import { Link } from 'react-router-dom';
import { Message, Item, Icon, Grid, Popup } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import { formatPrice } from '@api/utils';

const OrderLineLeftColumn = ({ line }) => {
  return (
    <>
      {line.recipient === 'PATRON' && (
        <Item.Description>
          <label>Patron: </label>
          <Link to={BackOfficeRoutes.patronDetailsFor(line.patron_pid)}>
            <Icon name="user" /> {line.patron_pid}
          </Link>
        </Item.Description>
      )}
      <Item.Description>
        <label>Document: </label>
        <Link to={BackOfficeRoutes.documentDetailsFor(line.document_pid)}>
          {line.document_pid}
        </Link>
      </Item.Description>
      <Item.Description>
        <label>Medium: </label> {line.medium}
      </Item.Description>
      <Item.Description>
        <label>Recipient: </label> {line.recipient}
      </Item.Description>
    </>
  );
};

const OrderLineMiddleColumn = ({ line }) => {
  return (
    <>
      <Item.Description>
        <label>Copies ordered: </label>
        {line.copies_ordered}
      </Item.Description>
      <Item.Description>
        <label>Copies received: </label>
        {line.copies_received}
      </Item.Description>
      <Item.Description>
        <label>Purchase type: </label>
        {line.purchase_type}
      </Item.Description>
      <Item.Description>
        <label>IDT ID: </label>
        {line.inter_departmental_transaction_id || 'None'}{' '}
        <Popup
          content="Inter departmental transaction ID"
          trigger={<Icon name="info circle" />}
        />
      </Item.Description>
    </>
  );
};

const OrderLineRightColumn = ({ line }) => {
  return (
    <>
      <Item.Description>
        <label>Payment mode: </label>
        {line.payment_mode}
      </Item.Description>
      <Item.Description>
        <label>Budget code: </label>
        {line.budget_code}
      </Item.Description>
      <Item.Description>
        <label>Total price: </label>
        {formatPrice(line.total_price)}
      </Item.Description>
      <Item.Description>
        <label>Unit price: </label>
        {formatPrice(line.unit_price)}
      </Item.Description>
    </>
  );
};

const OrderLine = ({ index, line }) => {
  return (
    <Item>
      <Item.Content>
        <Grid columns={3}>
          <Grid.Column>
            <OrderLineLeftColumn line={line} />
          </Grid.Column>
          <Grid.Column>
            <OrderLineMiddleColumn line={line} />
          </Grid.Column>
          <Grid.Column>
            <OrderLineRightColumn line={line} />
          </Grid.Column>
        </Grid>
      </Item.Content>
    </Item>
  );
};

export class OrderLines extends React.Component {
  render() {
    const { lines } = this.props;
    if (lines.length === 0) {
      return (
        <Message data-test="no-results">There are no order lines.</Message>
      );
    }

    return (
      <Item.Group divided className="bo-order-lines" id="order-lines">
        {lines.map((line, index) => (
          <OrderLine key={line.document_pid} index={index} line={line} />
        ))}
      </Item.Group>
    );
  }
}

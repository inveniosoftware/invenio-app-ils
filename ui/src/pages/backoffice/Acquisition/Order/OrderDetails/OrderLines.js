import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Message, Item, Icon, Grid, Popup } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import { formatPrice } from '@api/utils';
import { DocumentIcon } from '@pages/backoffice/components';
import { PatronIcon } from '@pages/backoffice/components/icons';

const OrderLineLeftColumn = ({ line }) => {
  return (
    <>
      {line.patron && (
        <Item.Description>
          <label>Patron: </label>
          <Link to={BackOfficeRoutes.patronDetailsFor(line.patron_pid)}>
            <PatronIcon /> {line.patron.name}
          </Link>
        </Item.Description>
      )}
      <Item.Description>
        <label>Medium: </label> {line.medium}
      </Item.Description>
      <Item.Description>
        <label>Recipient: </label> {line.recipient}
      </Item.Description>
      <Item.Description>
        <label>Purchase type: </label>
        {line.purchase_type}
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
        <label>Payment mode: </label>
        {line.payment_mode}
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
        <Item.Header
          as={Link}
          to={BackOfficeRoutes.documentDetailsFor(line.document.pid)}
        >
          <DocumentIcon />
          {line.document.title}
        </Item.Header>
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
      <Item.Group divided className="bo-order-lines">
        {lines.map((line, index) => (
          <OrderLine key={line.document_pid} index={index} line={line} />
        ))}
      </Item.Group>
    );
  }
}

OrderLines.proptTypes = {
  lines: PropTypes.array.isRequired,
};

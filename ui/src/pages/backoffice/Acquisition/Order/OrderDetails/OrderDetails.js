import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Accordion,
  Ref,
  Divider,
  Label,
  Grid,
  Sticky,
  Menu,
} from 'semantic-ui-react';
import history from '@history';
import { CopyButton, Loader, Error } from '@components';
import { OrderInformation } from './OrderInformation';
import { OrderStatistics } from './OrderStatistics';
import { PaymentInformation } from './PaymentInformation';
import { OrderLines } from './OrderLines';
import { DetailsHeader, EditButton } from '@pages/backoffice/components';
import { toShortDate } from '@api/date';
import { AcquisitionRoutes, BackOfficeRoutes } from '@routes/urls';
import { PatronIcon, OrderIcon } from '@pages/backoffice/components/icons';

class OrderHeader extends React.Component {
  renderStatus(status) {
    switch (status) {
      case 'CANCELLED':
        return <Label color="grey">Cancelled</Label>;
      case 'PENDING':
        return <Label color="yellow">Pending</Label>;
      case 'ORDERED':
        return <Label color="yellow">Ordered</Label>;
      case 'RECEIVED':
        return <Label color="green">Received</Label>;
      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  render() {
    const { data } = this.props;
    const vendor = data.metadata.vendor;
    const vendorLink = (
      <Link to={AcquisitionRoutes.vendorDetailsFor(vendor.pid)}>
        {vendor.name}
      </Link>
    );
    const pid = data.metadata.pid;

    return (
      <DetailsHeader
        title={
          <>
            Purchase Order #{data.metadata.pid}{' '}
            {this.renderStatus(data.metadata.status)}
          </>
        }
        subTitle={<>From vendor: {vendorLink}</>}
        pid={data.metadata.pid}
        icon={<OrderIcon />}
        recordType="Order"
      >
        <label>Order</label> #{pid} <CopyButton text={pid} />
        <br />
        <label>Ordered by </label>
        <Link
          to={BackOfficeRoutes.patronDetailsFor(data.metadata.created_by_pid)}
        >
          <PatronIcon />
          patron {data.metadata.created_by_pid}
        </Link>
        <br />
        <label>On</label> {toShortDate(data.metadata.order_date)}
      </DetailsHeader>
    );
  }
}

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.orderTopRef = props.anchors.orderTopRef;
    this.paymentInfoRef = props.anchors.paymentInfoRef;
    this.orderLinesRef = props.anchors.orderLinesRef;
    this.state = { activeItem: '' };
  }

  scrollTo(ref, menuItemName) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth' });
    this.setState({ activeItem: menuItemName });
  }
  render() {
    const order = this.props.data.metadata;
    const { activeItem } = this.state;

    return (
      <>
        <EditButton fluid to={AcquisitionRoutes.orderEditFor(order.pid)} />

        <Divider horizontal>Navigation</Divider>

        <Menu pointing secondary vertical fluid className="left">
          <Menu.Item
            name="orderInfo"
            active={activeItem === 'orderInfo'}
            onClick={(e, { name }) => this.scrollTo(this.orderTopRef, name)}
          >
            Order information
          </Menu.Item>
          <Menu.Item
            name="payment"
            active={activeItem === 'payment'}
            onClick={(e, { name }) => this.scrollTo(this.paymentInfoRef, name)}
          >
            Payment information
          </Menu.Item>
          <Menu.Item
            name="details"
            active={activeItem === 'details'}
            onClick={(e, { name }) => this.scrollTo(this.orderLinesRef, name)}
          >
            Order details
          </Menu.Item>
        </Menu>
      </>
    );
  }
}

class OrderMetadata extends React.Component {
  constructor(props) {
    super(props);
    this.paymentInfoRef = props.anchors.paymentInfoRef;
    this.orderLinesRef = props.anchors.orderLinesRef;
  }

  render() {
    const { data } = this.props;
    const panels = [
      {
        key: 'order-info',
        title: 'Order information',
        content: (
          <Accordion.Content>
            <OrderInformation order={data.metadata} />
          </Accordion.Content>
        ),
      },
      {
        key: 'payment-info',
        title: 'Payment information',
        content: (
          <Accordion.Content>
            <div ref={this.paymentInfoRef} id="payment">
              <PaymentInformation order={data.metadata} />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'order-lines',
        title: 'Order lines',
        content: (
          <Accordion.Content>
            <div ref={this.orderLinesRef} id="details">
              <OrderLines lines={data.metadata.resolved_order_lines} />
            </div>
          </Accordion.Content>
        ),
      },
    ];
    const defaultIndexes =
      data.metadata.status === 'CANCELLED' ? [0] : [0, 1, 2];

    return (
      <Container>
        <Accordion
          fluid
          styled
          className="highlighted"
          panels={panels}
          exclusive={false}
          defaultActiveIndex={defaultIndexes}
        />
      </Container>
    );
  }
}

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);

    this.paymentInfoRef = React.createRef();
    this.orderLinesRef = React.createRef();
    this.orderTopRef = React.createRef();
    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
    this.anchors = {
      paymentInfoRef: this.paymentInfoRef,
      orderLinesRef: this.orderLinesRef,
      orderTopRef: this.orderTopRef,
    };
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Order') {
        this.props.fetchOrderDetails(loc.state.pid);
      }
    });
    this.props.fetchOrderDetails(this.props.match.params.orderPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, error, data } = this.props;

    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <OrderHeader data={data} />
                </Container>
                <Divider />
              </Sticky>

              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container fluid className="spaced">
                        <div ref={this.orderTopRef}>
                          <OrderStatistics order={data.metadata} />
                        </div>
                      </Container>
                      <OrderMetadata data={data} anchors={this.anchors} />
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu data={data} anchors={this.anchors} />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

OrderDetails.propTypes = {
  data: PropTypes.object.isRequired,
  fetchOrderDetails: PropTypes.func.isRequired,
};

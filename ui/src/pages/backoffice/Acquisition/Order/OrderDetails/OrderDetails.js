import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Accordion,
  Ref,
  Divider,
  List,
  Label,
} from 'semantic-ui-react';
import history from '@history';
import { CopyButton, Loader, Error } from '@components';
import { OrderInformation } from './OrderInformation';
import { OrderStatistics } from './OrderStatistics';
import { PaymentInformation } from './PaymentInformation';
import { OrderLines } from './OrderLines';
import {
  DetailsHeader,
  DetailsMenu,
  EditButton,
} from '@pages/backoffice/components';
import { toShortDate } from '@api/date';
import { AcquisitionRoutes } from '@routes/urls';

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.contextRef = React.createRef();
    this.orderInfoRef = React.createRef();
    this.paymentInfoRef = React.createRef();
    this.orderLinesRef = React.createRef();
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

  scrollTo = ref => {
    ref.current.scrollIntoView({ behaviour: 'smooth' });
  };

  renderStickyMenu() {
    const order = this.props.data.metadata;
    return (
      <DetailsMenu contextRef={this.contextRef}>
        <List>
          <List.Item>
            <EditButton fluid to={AcquisitionRoutes.orderEditFor(order.pid)} />
          </List.Item>
        </List>
        <Divider horizontal>Navigation</Divider>
        <List>
          <List.Item>
            <List.Icon name="align justify" />
            <List.Content>
              <Link to={{}} onClick={() => this.scrollTo(this.orderInfoRef)}>
                Order information
              </Link>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="align justify" />
            <List.Content>
              <Link to={{}} onClick={() => this.scrollTo(this.paymentInfoRef)}>
                Payment information
              </Link>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="align justify" />
            <List.Content>
              <Link to={{}} onClick={() => this.scrollTo(this.orderLinesRef)}>
                Order lines
              </Link>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="industry" />
            <List.Content>
              <Link to={AcquisitionRoutes.vendorDetailsFor(order.vendor_pid)}>
                See {order.vendor.name}
              </Link>
            </List.Content>
          </List.Item>
        </List>
      </DetailsMenu>
    );
  }

  renderDetails = () => {
    const { data } = this.props;
    const panels = [
      {
        key: 'order-info',
        title: 'Order information',
        content: (
          <Accordion.Content>
            <div ref={this.orderInfoRef}>
              <OrderInformation order={data.metadata} />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'payment-info',
        title: 'Payment information',
        content: (
          <Accordion.Content>
            <div ref={this.paymentInfoRef}>
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
            <div ref={this.orderLinesRef}>
              <OrderLines lines={data.metadata.order_lines} />
            </div>
          </Accordion.Content>
        ),
      },
    ];
    const defaultIndexes =
      data.metadata.status === 'CANCELLED' ? [0] : [0, 1, 2];
    const vendor = data.metadata.vendor;
    const vendorLink = (
      <Link to={AcquisitionRoutes.vendorDetailsFor(vendor.pid)}>
        {vendor.name}
      </Link>
    );
    const pid = data.metadata.pid;
    const details = (
      <>
        <label>Order</label> #{pid} <CopyButton text={pid} />
        <br />
        <label>Ordered by</label> Someone
        <br />
        <label>On</label> {toShortDate(data.metadata.order_date)}
      </>
    );
    return (
      <Ref innerRef={this.contextRef}>
        <div className="bo-details">
          <DetailsHeader
            title={
              <>
                Purchase Order #{data.metadata.pid}{' '}
                {this.renderStatus(data.metadata.status)}
              </>
            }
            subTitle={<>From {vendorLink}</>}
            details={details}
            pid={data.metadata.pid}
            icon="shopping cart"
            recordType="Order"
          />
          <Container>
            <Divider />
            <OrderStatistics order={data.metadata} />
            <div className="bo-details-content">
              {this.renderStickyMenu()}
              <Accordion
                fluid
                styled
                panels={panels}
                exclusive={false}
                defaultActiveIndex={defaultIndexes}
              />
            </div>
          </Container>
        </div>
      </Ref>
    );
  };

  render() {
    const { isLoading, error, hasError } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          {!isLoading && !hasError && this.renderDetails()}
        </Error>
      </Loader>
    );
  }
}

OrderDetails.propTypes = {
  data: PropTypes.object.isRequired,
  fetchOrderDetails: PropTypes.func.isRequired,
};

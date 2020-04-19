import { toShortDate } from '@api/date';
import { CopyButton, CreatedBy, Error, Loader } from '@components';
import { DetailsHeader, EditButton } from '@pages/backoffice/components';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import { AcquisitionOrderIcon } from '@pages/backoffice/components/icons';
import { AcquisitionRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Divider,
  Grid,
  Header,
  Label,
  Message,
  Ref,
  Segment,
  Sticky,
} from 'semantic-ui-react';
import { OrderInformation } from './OrderInformation';
import { OrderLines } from './OrderLines';
import { OrderStatistics } from './OrderStatistics';
import { PaymentInformation } from './PaymentInformation';
import { OrderSteps } from './OrderSteps';

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
    const recordInfo = (
      <>
        <label>Order</label> #{pid} <CopyButton text={pid} />
        {data.metadata.created_by && (
          <>
            <br />
            <label className="muted">Created by</label>{' '}
            <CreatedBy metadata={data.metadata} />
          </>
        )}
        <br />
        <label>Order date</label> {toShortDate(data.metadata.order_date)}
      </>
    );
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
        icon={<AcquisitionOrderIcon />}
        recordInfo={recordInfo}
      />
    );
  }
}

class ActionMenu extends React.Component {
  render() {
    const order = this.props.data.metadata;

    return (
      <div className={'bo-action-menu'}>
        <EditButton fluid to={AcquisitionRoutes.orderEditFor(order.pid)} />

        <Message size="small">
          <Message.Header>Order deletion</Message.Header>
          <p>
            Orders cannot be deleted. You can cancel this order by changing its
            status when editing.
          </p>
        </Message>

        <Divider horizontal>Navigation</Divider>

        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem elementId="order-info" label="Order information" />
          <ScrollingMenuItem
            elementId="payment-info"
            label="Payment information"
          />
          <ScrollingMenuItem elementId="order-lines" label="Order details" />
        </ScrollingMenu>
      </div>
    );
  }
}

class OrderPanels extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <>
        <Header as="h3" attached="top">
          Order information
        </Header>
        <Segment attached className="bo-metadata-segment">
          <OrderInformation order={data.metadata} />
        </Segment>
        <Header as="h3" attached="top">
          Payment Information
        </Header>
        <Segment attached className="bo-metadata-segment">
          <PaymentInformation order={data.metadata} />
        </Segment>
        <Header as="h3" attached="top">
          Order lines
        </Header>
        <Segment attached className="bo-metadata-segment">
          <OrderLines lines={data.metadata.resolved_order_lines} />
        </Segment>
      </>
    );
  }
}

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);

    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchOrderDetails(this.props.match.params.orderPid);
  }

  componentDidUpdate(prevProps) {
    const orderPid = this.props.match.params.orderPid;
    const samePidFromRouter = prevProps.match.params.orderPid === orderPid;
    if (!samePidFromRouter) {
      this.props.fetchOrderDetails(orderPid);
    }
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
                      <Container className="spaced">
                        <Container className="spaced">
                          <OrderStatistics order={data.metadata} />
                          <br />
                          <OrderSteps order={data.metadata} />
                        </Container>
                        <OrderPanels data={data} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu data={data} offset={-150} />
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

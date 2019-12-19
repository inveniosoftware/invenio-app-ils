import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Accordion,
  Ref,
  Divider,
  List,
  Sticky,
  Menu,
  Icon,
  Grid,
} from 'semantic-ui-react';
import history from '@history';
import { CopyButton, Loader, Error } from '@components';
import { VendorInformation } from './VendorInformation';
import {
  DetailsHeader,
  EditButton,
  DeleteRecordModal,
} from '@pages/backoffice/components';
import { AcquisitionRoutes } from '@routes/urls';
import { order as orderApi } from '@api';
import { VendorIcon } from '@pages/backoffice/components/icons';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';

const DeleteVendorButton = props => {
  return (
    <DeleteButton
      fluid
      content="Delete vendor"
      labelPosition="left"
      {...props}
    />
  );
};

class ActionMenu extends React.Component {
  createRefProps(vendorPid) {
    const orderRefProps = {
      refType: 'Order',
      onRefClick: orderPid =>
        window.open(
          AcquisitionRoutes.orderDetailsFor(orderPid),
          `_order_${orderPid}`
        ),
      getRefData: () =>
        orderApi.list(
          orderApi
            .query()
            .withVendorPid(vendorPid)
            .qs()
        ),
    };

    return [orderRefProps];
  }

  render() {
    const vendor = this.props.data.metadata;

    return (
      <Sticky context={this.contextRef}>
        <EditButton fluid to={AcquisitionRoutes.vendorEditFor(vendor.pid)} />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the Vendor record
              with ID ${vendor.pid}?`}
          refProps={this.createRefProps(vendor.pid)}
          onDelete={() => this.deleteVendor(vendor.pid)}
          trigger={DeleteVendorButton}
        />

        <Divider horizontal>Navigation</Divider>

        <Link
          to={AcquisitionRoutes.ordersListWithQuery(
            orderApi
              .query()
              .withVendorPid(vendor.pid)
              .qs()
          )}
        >
          <Icon name={'search'} />
          See orders from {vendor.name}
        </Link>
      </Sticky>
    );
  }
}

class VendorHeader extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <DetailsHeader
        title={data.metadata.name}
        pid={data.metadata.pid}
        icon={<VendorIcon />}
        recordType="Vendor"
      >
        <label>Vendor</label> #{data.metadata.pid}
        <CopyButton text={data.metadata.pid} />
      </DetailsHeader>
    );
  }
}

class VendorDetailsInner extends React.Component {
  constructor(props) {
    super(props);
    this.contextRef = React.createRef();
  }

  render() {
    const { data } = this.props;
    const panels = [
      {
        key: 'vendor-info',
        title: 'Vendor information',
        content: (
          <Accordion.Content>
            <div ref={this.vendorInfoRef}>
              <VendorInformation vendor={data.metadata} />
            </div>
          </Accordion.Content>
        ),
      },
    ];
    const defaultIndexes =
      data.metadata.status === 'CANCELLED' ? [0] : [0, 1, 2];

    return (
      <Accordion
        fluid
        styled
        className="highlighted"
        panels={panels}
        exclusive={false}
        defaultActiveIndex={defaultIndexes}
      />
    );
  }
}

export default class VendorDetails extends React.Component {
  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Vendor') {
        this.props.fetchVendorDetails(loc.state.pid);
      }
    });
    this.props.fetchVendorDetails(this.props.match.params.vendorPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { data, isLoading, error } = this.props;

    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <VendorHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <VendorDetailsInner data={data} />
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu data={data} />
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

VendorDetails.propTypes = {
  data: PropTypes.object.isRequired,
  fetchVendorDetails: PropTypes.func.isRequired,
};

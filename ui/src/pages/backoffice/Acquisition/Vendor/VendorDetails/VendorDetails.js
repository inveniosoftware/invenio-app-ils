import { acqOrder as orderApi } from '@api';
import { CopyButton, Error, Loader } from '@components';
import { goTo } from '@history';
import {
  DeleteRecordModal,
  DetailsHeader,
  EditButton,
} from '@pages/backoffice/components';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { AcquisitionVendorIcon } from '@pages/backoffice/components/icons';
import { AcquisitionRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Container,
  Divider,
  Grid,
  Icon,
  Ref,
  Sticky,
} from 'semantic-ui-react';
import { VendorInformation } from './VendorInformation';

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
      onRefClick: orderPid => goTo(AcquisitionRoutes.orderDetailsFor(orderPid)),
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
      <div className={'bo-action-menu'}>
        <Sticky context={this.contextRef}>
          <EditButton fluid to={AcquisitionRoutes.vendorEditFor(vendor.pid)} />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Vendor record
              with ID ${vendor.pid}?`}
            refProps={this.createRefProps(vendor.pid)}
            onDelete={() => this.props.deleteVendorHandler(vendor.pid)}
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
      </div>
    );
  }
}

class VendorHeader extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <DetailsHeader
        title={data.metadata.name}
        pid={data.metadata.pid}
        icon={<AcquisitionVendorIcon />}
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

    return (
      <Accordion
        fluid
        styled
        className="highlighted"
        panels={panels}
        exclusive={false}
        defaultActiveIndex={[0]}
      />
    );
  }
}

export default class VendorDetails extends React.Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchVendorDetails(this.props.match.params.vendorPid);
  }

  componentDidUpdate(prevProps) {
    const vendorPid = this.props.match.params.vendorPid;
    const samePidFromRouter = prevProps.match.params.vendorPid === vendorPid;
    if (!samePidFromRouter) {
      this.props.fetchVendorDetails(vendorPid);
    }
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
                        <ActionMenu
                          data={data}
                          deleteVendorHandler={this.props.deleteVendor}
                        />
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

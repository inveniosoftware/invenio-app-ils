import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Accordion, Ref, Divider, List } from 'semantic-ui-react';
import history from '@history';
import { CopyButton, Loader, Error } from '@components';
import { VendorInformation } from './VendorInformation';
import {
  DetailsHeader,
  DetailsMenu,
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

class VendorDetailsInner extends React.Component {
  constructor(props) {
    super(props);
    this.contextRef = React.createRef();
  }

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

  renderStickyMenu() {
    const vendor = this.props.data.metadata;
    return (
      <DetailsMenu contextRef={this.contextRef}>
        <List>
          <List.Item>
            <EditButton
              fluid
              to={AcquisitionRoutes.vendorEditFor(vendor.pid)}
            />
            <DeleteRecordModal
              deleteHeader={`Are you sure you want to delete the Vendor record
              with ID ${vendor.pid}?`}
              refProps={this.createRefProps(vendor.pid)}
              onDelete={() => this.deleteVendor(vendor.pid)}
              trigger={DeleteVendorButton}
            />
          </List.Item>
        </List>
        <Divider horizontal>Navigation</Divider>
        <List>
          <List.Item>
            <List.Icon name="search" />
            <List.Content>
              <Link
                to={AcquisitionRoutes.ordersListWithQuery(
                  orderApi
                    .query()
                    .withVendorPid(vendor.pid)
                    .qs()
                )}
              >
                Orders from {vendor.name}
              </Link>
            </List.Content>
          </List.Item>
        </List>
      </DetailsMenu>
    );
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
    const pid = data.metadata.pid;
    const details = (
      <>
        <label>Vendor</label> #{pid} <CopyButton text={pid} />
      </>
    );
    return (
      <Ref innerRef={this.contextRef}>
        <div className="bo-details">
          <DetailsHeader
            title={data.metadata.name}
            details={details}
            pid={data.metadata.pid}
            icon={<VendorIcon />}
            recordType="Vendor"
          />
          <Container>
            <Divider />
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
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <VendorDetailsInner data={data} />
        </Error>
      </Loader>
    );
  }
}

VendorDetails.propTypes = {
  data: PropTypes.object.isRequired,
  fetchVendorDetails: PropTypes.func.isRequired,
};

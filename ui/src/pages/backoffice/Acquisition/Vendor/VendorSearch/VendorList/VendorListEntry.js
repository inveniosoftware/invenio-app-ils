import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Icon, Item, List } from 'semantic-ui-react';
import { AcquisitionRoutes } from '@routes/urls';
import { acqOrder as orderApi } from '@api';
import { AcquisitionVendorIcon } from '@pages/backoffice/components/icons';

const VendorListInfo = ({ vendor }) => (
  <List verticalAlign="middle" className={'document-circulation'}>
    <List.Item>
      <List.Content>
        email <strong>{vendor.metadata.email}</strong>
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Content>
        phone <strong>{vendor.metadata.phone}</strong>
      </List.Content>
    </List.Item>
  </List>
);

const VendorOrderSearch = ({ vendor }) => {
  const orderQuery = orderApi
    .query()
    .withVendorPid(vendor.metadata.pid)
    .qs();
  return (
    <List.Item>
      <List.Content>
        <Link to={AcquisitionRoutes.ordersListWithQuery(orderQuery)}>
          <Icon name="search" />
          Find purchase orders
        </Link>
      </List.Content>
    </List.Item>
  );
};

export default class VendorListEntry extends Component {
  renderMiddleColumn = vendor => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(vendor);
    }
    return <VendorListInfo vendor={vendor} />;
  };

  renderRightColumn = vendor => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(vendor);
    }
    return <VendorOrderSearch vendor={vendor} />;
  };

  renderAddress = () => {
    const address = this.props.vendor.metadata.address;
    if (!address) return null;

    return (
      <Item.Description>
        <p>
          {address.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </Item.Description>
    );
  };

  render() {
    const { vendor } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={AcquisitionRoutes.vendorDetailsFor(vendor.metadata.pid)}
            data-test={`navigate-${vendor.metadata.pid}`}
          >
            <AcquisitionVendorIcon />
            {vendor.metadata.name}
          </Item.Header>
          <Item.Meta>Address:</Item.Meta>
          <Grid highlight={3}>
            <Grid.Column computer={6} largeScreen={6}>
              {this.renderAddress()}
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              {this.renderMiddleColumn(vendor)}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column computer={2} largeScreen={2}>
              {this.renderRightColumn(vendor)}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className={'pid-field'}>#{vendor.metadata.pid}</div>
      </Item>
    );
  }
}

VendorListEntry.propTypes = {
  vendor: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};

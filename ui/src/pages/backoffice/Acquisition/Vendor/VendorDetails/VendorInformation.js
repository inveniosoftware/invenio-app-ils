import React from 'react';
import { Grid } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice';
import { EmailLink, EmailCopyToClipboard } from '@components';

export class VendorInformation extends React.Component {
  render() {
    const vendor = this.props.vendor;
    const leftTable = [
      { name: 'Name', value: vendor.name },
      {
        name: 'Email',
        value: (
          <span>
            <EmailLink email={vendor.email} />{' '}
            <EmailCopyToClipboard email={vendor.email} />
          </span>
        ),
      },
      { name: 'Phone', value: vendor.phone },
    ];
    const rightTable = [
      { name: 'Address', value: vendor.address },
      { name: 'Notes', value: vendor.notes },
    ];
    return (
      <Grid columns={2} id="vendor-info">
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

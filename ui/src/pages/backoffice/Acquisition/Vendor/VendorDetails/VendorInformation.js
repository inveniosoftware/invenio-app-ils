import React from 'react';
import { Grid } from 'semantic-ui-react';
import { KeyValueTable } from '@pages/backoffice/components';
import { EmailLink } from '@components/EmailLink/EmailLink';

export class VendorInformation extends React.Component {
  render() {
    const vendor = this.props.vendor;
    const leftTable = [
      { key: 'Name', value: vendor.name },
      { key: 'Email', value: <EmailLink email={vendor.email} /> },
      { key: 'Phone', value: vendor.phone },
    ];
    const rightTable = [
      { key: 'Address', value: vendor.address },
      { key: 'Notes', value: vendor.notes },
    ];
    return (
      <Grid columns={2} id="vendor-info">
        <Grid.Row>
          <Grid.Column>
            <KeyValueTable data={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <KeyValueTable keyWidth={3} data={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

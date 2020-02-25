import MetadataTable from '@pages/backoffice/components/MetadataTable/MetadataTable';
import React from 'react';
import { Component } from 'react';
import ShowMore from 'react-show-more';
import { Grid, Segment, Header } from 'semantic-ui-react';

export default class ItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteItem = props.deleteItem;
    this.itemPid = this.props.itemDetails.metadata.pid;
  }

  render() {
    const { itemDetails } = this.props;

    const metadata = [
      { name: 'Barcode', value: itemDetails.metadata.barcode },
      {
        name: 'Loan restrictions',
        value: itemDetails.metadata.circulation_restriction,
      },
      { name: 'Medium', value: itemDetails.metadata.medium },
      { name: 'Status', value: itemDetails.metadata.status },
      { name: 'Legacy ID', value: itemDetails.metadata.legacy_id },
      {
        name: 'Legacy library ID',
        value: itemDetails.metadata.legacy_library_id,
      },
    ];

    return (
      <>
        <Header as="h3" attached="top">
          Metadata
        </Header>
        <Segment attached className="bo-metadata-segment" id="metadata">
          <Grid padded columns={2}>
            <Grid.Row>
              <Grid.Column width={8}>
                <MetadataTable rows={metadata} />
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as="h4">Description</Header>
                <ShowMore
                  lines={5}
                  more="Show more"
                  less="Show less"
                  anchorClass="button-show-more"
                >
                  {itemDetails.metadata.description}
                </ShowMore>
                <Header as="h4">Internal notes</Header>
                <ShowMore
                  lines={5}
                  more="Show more"
                  less="Show less"
                  anchorClass="button-show-more"
                >
                  {itemDetails.metadata.internal_notes}
                </ShowMore>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </>
    );
  }
}

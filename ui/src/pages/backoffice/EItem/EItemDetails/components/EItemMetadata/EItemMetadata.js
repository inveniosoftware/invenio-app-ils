import { MetadataTable } from '@pages/backoffice/components';
import { UrlList } from '@pages/backoffice/components/UrlList';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ShowMore from 'react-show-more';
import { Grid, Header, Segment } from 'semantic-ui-react';

export default class EItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.eitemPid = this.props.eitemDetails.metadata.pid;
  }

  render() {
    const { eitemDetails } = this.props;

    const metadata = [
      { name: 'Document PID', value: eitemDetails.metadata.document_pid },
      {
        name: 'Open access',
        value: eitemDetails.metadata.open_access ? 'Yes' : 'No',
      },
      {
        name: 'Available urls',
        value: <UrlList urls={eitemDetails.metadata.urls} />,
      },
    ];

    return (
      <>
        <Header as="h3" attached="top">
          Metadata
        </Header>
        <Segment attached className="eitem-metadata" id="metadata">
          <Grid padded columns={2}>
            <Grid.Row>
              <Grid.Column>
                <MetadataTable rows={metadata} />
              </Grid.Column>
              <Grid.Column>
                <Header as="h4">Description</Header>
                <ShowMore
                  lines={5}
                  more="Show more"
                  less="Show less"
                  anchorClass="button-show-more"
                >
                  {eitemDetails.metadata.description}
                </ShowMore>
                <Header as="h4">Internal notes</Header>
                <ShowMore
                  lines={5}
                  more="Show more"
                  less="Show less"
                  anchorClass="button-show-more"
                >
                  {eitemDetails.metadata.internal_notes}
                </ShowMore>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </>
    );
  }
}

EItemMetadata.propTypes = {
  eitemDetails: PropTypes.object.isRequired,
};

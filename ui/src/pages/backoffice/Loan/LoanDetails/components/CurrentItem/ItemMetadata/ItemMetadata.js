import { MetadataTable } from '@pages/backoffice/components';
import { ItemDetailsLink } from '@pages/backoffice/components/buttons/ViewDetailsButtons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ShowMore from 'react-show-more';
import { Container, Grid, Header } from 'semantic-ui-react';

export default class ItemMetadata extends Component {
  render() {
    const { item } = this.props;
    const metadata = [
      { name: 'PID', value: item.pid },
      {
        name: 'Barcode',
        value: (
          <ItemDetailsLink itemPid={item.pid}>{item.barcode}</ItemDetailsLink>
        ),
      },
      { name: 'Medium', value: item.medium },
    ];
    return (
      <>
        <Grid className="item-metadata" padded columns={2}>
          <Grid.Column>
            <MetadataTable rows={metadata} />
          </Grid.Column>

          <Grid.Column>
            <Container>
              <Header as="h4">Description</Header>
              <ShowMore
                lines={4}
                more="Show more"
                less="Show less"
                anchorClass="button-show-more"
              >
                {item.description}
              </ShowMore>
            </Container>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

ItemMetadata.propTypes = {
  item: PropTypes.object.isRequired,
};

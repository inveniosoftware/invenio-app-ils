import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Container,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '../../../components/MetadataTable';

export default class DocumentMetadata extends Component {
  openEditor(url) {
    window.open(`/editor?url=${url}`, url);
  }

  render() {
    const data = {
      ...this.props.documentDetails,
      ...this.props.documentDetails.metadata,
    };

    const documentUrl = this.props.documentDetails.links.self;

    const rows = [
      { name: 'Title', value: data.title },
      { name: 'Authors', value: data.authors },
    ];

    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          <Grid.Column width={14}>
            <Header as="h1">
              Document #{data.id} - {data.title}
            </Header>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button
              primary
              floated="right"
              size="small"
              onClick={() => this.openEditor(documentUrl)}
            >
              <Icon name="edit" />
              edit
            </Button>
          </Grid.Column>

          <Grid.Column>
            <MetadataTable rows={rows} />
          </Grid.Column>

          <Grid.Column>
            <Container>
              <Header as="h3">Abstract</Header>
              <p>{data.abstracts}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};

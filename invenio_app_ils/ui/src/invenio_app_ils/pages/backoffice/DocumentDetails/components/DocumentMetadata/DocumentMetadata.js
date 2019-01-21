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

    const columns = [
      { name: 'Created', data_key: 'created' },
      { name: 'Updated', data_key: 'updated' },
      { name: 'Title', data_key: 'title' },
      { name: 'Authors', data_key: 'authors' },
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
            <MetadataTable columns={columns} entry={data} />
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

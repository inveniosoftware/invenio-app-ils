import React, { Component } from 'react';
import { Grid, Segment, Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import { document as documentApi } from '../../../../../common/api';
import { openRecordEditor } from '../../../../../common/urls';

export default class DocumentMetadata extends Component {
  render() {
    const document = this.props.documentDetails;
    const rows = [
      { name: 'Title', value: document.title },
      { name: 'Authors', value: document.authors },
    ];
    const header = (
      <Grid.Row>
        <Grid.Column width={14} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{document.document_pid} - {document.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={2} textAlign={'right'}>
          <EditButton
            clickHandler={() =>
              openRecordEditor(documentApi.url, document.document_pid)
            }
          />
        </Grid.Column>
      </Grid.Row>
    );

    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {header}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstract</Header>
                <p>{document.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};

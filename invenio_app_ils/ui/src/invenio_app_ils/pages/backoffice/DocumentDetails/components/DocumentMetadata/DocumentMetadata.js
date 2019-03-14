import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Container, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import { document as documentApi } from '../../../../../common/api';
import {
  documentsSearchQueryUrl,
  openRecordEditor,
} from '../../../../../common/urls';

export default class DocumentMetadata extends Component {
  _renderKeywords(keywords) {
    return (
      <List horizontal>
        {keywords.map(keyword => (
          <List.Item key={keyword.name}>
            <Link
              to={documentsSearchQueryUrl(
                documentApi
                  .query()
                  .withKeyword(keyword)
                  .qs()
              )}
            >
              {keyword.name}
            </Link>
          </List.Item>
        ))}
      </List>
    );
  }

  render() {
    const document = this.props.documentDetails;
    const rows = [
      { name: 'Title', value: document.title },
      { name: 'Authors', value: document.authors },
    ];
    if (!_isEmpty(document.keywords)) {
      rows.push({
        name: 'Keywords',
        value: this._renderKeywords(document.keywords),
      });
    }
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

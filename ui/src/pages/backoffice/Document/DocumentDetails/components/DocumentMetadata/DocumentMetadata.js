import {DocumentAbstract} from "@components/Document";
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Segment,
  Container,
  Header,
  List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import {
  document as documentApi,
} from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = props.deleteDocument;
    this.documentPid = props.documentDetails.metadata.pid;
  }

  renderTags(tags) {
    if (!isEmpty(tags)) {
      return (
        <List horizontal>
          {tags.map(tag => (
            <List.Item key={tag}>
              <Link
                to={BackOfficeRoutes.documentsListWithQuery(
                  documentApi
                    .query()
                    .withTag(tag)
                    .qs()
                )}
              >
                {tag.name}
              </Link>
            </List.Item>
          ))}
        </List>
      );
    } else {
      return null;
    }
  }

  prepareData(document) {
    const rows = [
      { name: 'Title', value: document.metadata.title },
      {
        name: 'Authors',
        value: document.metadata.authors
          ? document.metadata.authors.map(author => author.full_name).join(',')
          : '',
      },
      {
        name: 'Keywords',
        value: document.metadata.keywords
          ? document.metadata.keywords.value +
            ' (' +
            document.metadata.keywords.source +
            ')'
          : null,
      },
      {
        name: 'Tags',
        value: this.renderTags(document.metadata.tags),
      },
    ];
    const request = document.metadata.request;
    if (!isEmpty(request)) {
      rows.push({
        name: 'Document Request',
        value: (
          <Link to={BackOfficeRoutes.documentRequestDetailsFor(request.pid)}>
            {request.state}
          </Link>
        ),
      });
    }
    return rows;
  }


  render() {
    const document = this.props.documentDetails;
    const rows = this.prepareData(document);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstract</Header>
                 <DocumentAbstract metadata={document.metadata} lines={20} />
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

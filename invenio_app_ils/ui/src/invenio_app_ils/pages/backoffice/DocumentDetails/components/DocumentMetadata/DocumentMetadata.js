import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Container, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import {
  document as documentApi,
  loan as loanApi,
} from '../../../../../common/api';
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';

export class DocumentMetadata extends Component {
  _renderKeywords(keywords) {
    return (
      <List horizontal>
        {keywords.map(keyword => (
          <List.Item key={keyword.name}>
            <Link
              to={BackOfficeRoutes.documentsListWithQuery(
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

  _handleOnRefClick(loanPid) {
    const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
    window.open(navUrl, `_loan_${loanPid}`);
  }

  render() {
    const document = this.props.data;
    const rows = [
      { name: 'Title', value: document.metadata.title },
      { name: 'Authors', value: document.metadata.authors },
    ];
    if (!_isEmpty(document.metadata.keywords)) {
      rows.push({
        name: 'Keywords',
        value: this._renderKeywords(document.metadata.keywords),
      });
    }
    const header = (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{document.document_pid} - {document.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <EditButton
            clickHandler={() =>
              openRecordEditor(documentApi.url, document.document_pid)
            }
          />
          <DeleteRecordModal
            headerContent={`Are you sure you want to delete the Document
            record with ID ${document.document_pid}?`}
            onDelete={() => this.deleteDocument(document.document_pid)}
            refType={'Loan'}
            onRefClick={this._handleOnRefClick}
            checkRefs={() =>
              loanApi.list(
                `document_pid:${
                  document.document_pid
                } AND state:(PENDING OR ITEM_ON_LOAN)`
              )
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
                <p>{document.metadata.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  data: PropTypes.oneOfType([
    () => null,
    PropTypes.shape({
      document_pid: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        abstracts: PropTypes.arrayOf(PropTypes.string).isRequired,
        authors: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired,
        keywords: PropTypes.arrayOf(
          PropTypes.shape({
            keyword_pid: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      }).isRequired,
    }).isRequired,
  ]).isRequired,
};

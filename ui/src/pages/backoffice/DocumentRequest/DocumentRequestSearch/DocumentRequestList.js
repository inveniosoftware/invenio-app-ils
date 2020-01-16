import { DocumentRequestIcon } from '@pages/backoffice';
import React, { Component } from 'react';
import { Grid, Header, Item, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SearchEmptyResults } from '@components/SearchControls';
import { BackOfficeRoutes } from '@routes/urls';

class DocumentRequestListEntry extends Component {
  render() {
    const { documentRequest } = this.props;

    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.documentRequestDetailsFor(
              documentRequest.metadata.pid
            )}
            data-test={`navigate-${documentRequest.metadata.pid}`}
          >
            <DocumentRequestIcon /> Literature request #
            {documentRequest.metadata.pid}
          </Item.Header>
          <Grid columns={5}>
            <Grid.Column computer={7} largeScreen={7}>
              <label>Patron</label>{' '}
              <Link
                to={BackOfficeRoutes.patronDetailsFor(
                  documentRequest.metadata.patron_pid
                )}
              >
                {documentRequest.metadata.patron.name}
              </Link>{' '}
              requested:
              <Item.Meta className="document-authors">
                <Header className="list-entry-title" as="h5">
                  {documentRequest.metadata.title}
                </Header>
                by <label>{documentRequest.metadata.authors}</label>
              </Item.Meta>
              {documentRequest.metadata.issn && (
                <>
                  <label>ISSN</label> {documentRequest.metadata.issn}
                </>
              )}
              {documentRequest.metadata.isbn && (
                <>
                  <label>ISBN</label> {documentRequest.metadata.issn}
                </>
              )}
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={3}>
              <List>
                <List.Item>
                  <List.Content>
                    <label>State</label> {documentRequest.metadata.state}
                  </List.Content>
                </List.Item>
                {documentRequest.metadata.reject_reason && (
                  <List.Item>
                    <List.Content>
                      <label>Reject reason </label>
                      {documentRequest.metadata.reject_reason}
                    </List.Content>
                  </List.Item>
                )}
                {documentRequest.metadata.document_pid && (
                  <List.Item>
                    <List.Content>
                      <label>Document </label>
                      <Link
                        to={BackOfficeRoutes.documentDetailsFor(
                          documentRequest.metadata.document_pid
                        )}
                      >
                        {documentRequest.metadata.document.title}
                      </Link>
                    </List.Content>
                  </List.Item>
                )}
              </List>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              {documentRequest.metadata.publication_year && (
                <>
                  <label>published</label>{' '}
                  {documentRequest.metadata.publication_year}
                </>
              )}
              <br />
              {documentRequest.metadata.volume && (
                <>
                  <label>volume</label> {documentRequest.metadata.volume}
                </>
              )}
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Item.Meta className={'pid-field'}>
                <Header disabled as="h5" className={'pid-field'}>
                  #{documentRequest.metadata.pid}
                </Header>
              </Item.Meta>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

export default class DocumentRequestList extends Component {
  renderListEntry = documentRequest => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(documentRequest);
    }
    return (
      <DocumentRequestListEntry
        key={documentRequest.metadata.pid}
        documentRequest={documentRequest}
      />
    );
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults />;

    return (
      <Item.Group divided className={'bo-document-request-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

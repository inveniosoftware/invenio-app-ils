import { toShortDate } from '@api/date';
import { DocumentTags } from '@components/Document';
import { DetailsHeader, DocumentIcon } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Container,
  Divider,
  Grid,
  Header,
  Ref,
  Sticky,
} from 'semantic-ui-react';
import history from '@history';
import { Loader, Error, CopyButton, DocumentAuthors } from '@components';
import {
  DocumentMetadata,
  DocumentPendingLoans,
  DocumentRelations,
  DocumentStats,
  DocumentItems,
  DocumentActionMenu,
  DocumentSummary,
} from './components';

class DocumentHeader extends Component {
  render() {
    const { data } = this.props;

    const recordInfo = (
      <>
        <label>Document</label> #{data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        {(
          <>
            <br />
            <label>Created by</label>{' '}
          </>
        ) && data.metadata.created_by}
        <br />
        <label>Created on</label> {toShortDate(data.created)}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>{data.metadata.document_type}</Header.Subheader>
            {data.metadata.title} - ed. {data.metadata.edition}
          </>
        }
        subTitle={<DocumentAuthors metadata={data.metadata} prefix={'by '} />}
        pid={data.metadata.pid}
        icon={<DocumentIcon />}
        recordType="Document"
        recordInfo={recordInfo}
      >
        <DocumentTags metadata={data.metadata} />
      </DetailsHeader>
    );
  }
}

class DocumentContent extends Component {
  render() {
    const { data } = this.props;
    const panels = [
      {
        key: 'metadata',
        title: 'Metadata',
        content: (
          <Accordion.Content>
            <DocumentMetadata />
          </Accordion.Content>
        ),
      },
      {
        key: 'loan-requests',
        title: 'Loan requests',
        content: (
          <Accordion.Content>
            <DocumentPendingLoans />
          </Accordion.Content>
        ),
      },
      {
        key: 'document-items',
        title: 'Attached items',
        content: (
          <Accordion.Content>
            <DocumentItems />
          </Accordion.Content>
        ),
      },
      {
        key: 'document-relations',
        title: 'Relations',
        content: (
          <Accordion.Content>
            <DocumentRelations />
          </Accordion.Content>
        ),
      },
      {
        key: 'document-statistics',
        title: 'Statistics',
        content: (
          <Accordion.Content>
            <DocumentStats />
          </Accordion.Content>
        ),
      },
    ];
    const defaultIndexes =
      data.metadata.status === 'CANCELLED' ? [0] : [0, 1, 2];

    return (
      <Accordion
        fluid
        styled
        className="highlighted"
        panels={panels}
        exclusive={false}
        defaultActiveIndex={defaultIndexes}
      />
    );
  }
}

export default class DocumentDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;
    this.menuRef = React.createRef();
    this.headerRef = React.createRef();
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Document') {
        this.fetchDocumentDetails(loc.state.pid);
      }
    });
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, error, data } = this.props;
    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <DocumentHeader data={data} />
                </Container>
                <Divider />
              </Sticky>

              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container fluid className="spaced">
                        <DocumentSummary document={data} />
                      </Container>
                      <Container>
                        <DocumentContent data={data} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={180}>
                        <DocumentActionMenu />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

DocumentDetails.propTypes = {
  fetchDocumentDetails: PropTypes.func.isRequired,
};

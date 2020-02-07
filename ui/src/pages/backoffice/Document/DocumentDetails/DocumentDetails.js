import { toShortDate } from '@api/date';
import { DocumentTags, DocumentTitle } from '@components/Document';
import { DetailsHeader, DocumentIcon } from '@pages/backoffice';
import { DocumentEItems } from './components';
import {
  DocumentSeries,
  DocumentSiblings,
} from './components/DocumentRelations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Container,
  Divider,
  Grid,
  Header,
  Label,
  Ref,
  Sticky,
} from 'semantic-ui-react';
import history from '@history';
import { Loader, Error, CopyButton, DocumentAuthors } from '@components';
import {
  DocumentMetadata,
  DocumentPendingLoans,
  DocumentStats,
  DocumentItems,
  DocumentActionMenu,
  DocumentSummary,
  DocumentCreatedBy,
} from './components';

class DocumentHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <Label className="muted">Document</Label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        {data.metadata.created_by && (
          <>
            <br />
            <Label className="muted">Created by</Label>{' '}
            <DocumentCreatedBy metadata={data.metadata} />
          </>
        )}
        <br />
        <Label className="muted">Created on</Label> {toShortDate(data.created)}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>{data.metadata.document_type}</Header.Subheader>
            <DocumentTitle document={data} />
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
    const { anchors } = this.props;
    const panels = [
      {
        key: 'loan-requests',
        title: 'Loan requests',
        content: (
          <Accordion.Content>
            <div ref={anchors.loanRequestsRef} id="loan-requests">
              <DocumentPendingLoans />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-items',
        title: 'Physical items',
        content: (
          <Accordion.Content>
            <div ref={anchors.attachedItemsRef} id="document-items">
              <DocumentItems />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-eitems',
        title: 'Electronic items',
        content: (
          <Accordion.Content>
            <div ref={anchors.attachedEItemsRef} id="document-eitems">
              <DocumentEItems />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-series',
        title: 'Series',
        content: (
          <Accordion.Content>
            <DocumentSeries />
          </Accordion.Content>
        ),
      },
      {
        key: 'document-siblings',
        title: 'Related',
        content: (
          <Accordion.Content>
            <DocumentSiblings />
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
    const defaultIndexes = [0, 1, 3];

    return (
      <>
        <Accordion
          fluid
          styled
          className="highlighted"
          panels={panels}
          exclusive={false}
          defaultActiveIndex={defaultIndexes}
        />
      </>
    );
  }
}

export default class DocumentDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;

    this.menuRef = React.createRef();
    this.headerRef = React.createRef();
    this.loanRequestsRef = React.createRef();
    this.attachedItemsRef = React.createRef();
    this.attachedEItemsRef = React.createRef();
    this.seriesRef = React.createRef();
    this.relatedRef = React.createRef();
    this.statisticsRef = React.createRef();

    this.anchors = {
      loanRequestsRef: this.loanRequestsRef,
      attachedItemsRef: this.attachedItemsRef,
      attachedEItemsRef: this.attachedEItemsRef,
      seriesRef: this.seriesRef,
      relatedRef: this.relatedRef,
      statisticsRef: this.statisticsRef,
    };
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
                      <Container className="spaced">
                        <Container className="spaced">
                          <DocumentSummary
                            anchors={this.anchors}
                            document={data}
                          />
                        </Container>
                        <DocumentMetadata />
                        <DocumentContent anchors={this.anchors} data={data} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={180}>
                        <DocumentActionMenu anchors={this.anchors} />
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

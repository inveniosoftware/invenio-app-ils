import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Segment,
  Container,
  Header,
  List,
  Label,
  Icon,
  Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { invenioConfig } from '../../../../../common/config';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import {
  document as documentApi,
  loan as loanApi,
  item as itemApi,
  keyword as keywordApi,
} from '../../../../../common/api';
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import { serializeKeyword } from '../../../../../common/components/ESSelector/serializer';
import { DocumentAccessRestrictions } from '../DocumentAccessRestrictions';

const getReadAccessSet = document => {
  if (document.metadata._access && document.metadata._access.read) {
    return new Set(document.metadata._access.read);
  } else return new Set([]);
};

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = props.deleteDocument;
  }

  updateKeywords = results => {
    const documentPid = this.props.documentDetails.metadata.document_pid;
    const keywordPids = results.map(result => result.metadata.keyword_pid);
    this.props.updateDocument(documentPid, '/keyword_pids', keywordPids);
  };

  renderKeywords(keywords) {
    const keywordSelection = keywords.map(serializeKeyword);
    return (
      <List horizontal>
        {keywords.map(keyword => (
          <List.Item key={keyword.keyword_pid}>
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
        <List.Item>
          <ESSelectorModal
            multiple
            initialSelections={keywordSelection}
            trigger={<Button basic color="blue" size="small" content="edit" />}
            query={keywordApi.list}
            title="Select Keywords"
            onSave={this.updateKeywords}
          />
        </List.Item>
      </List>
    );
  }

  handleOnRefClick(loanPid) {
    const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
    window.open(navUrl, `_loan_${loanPid}`);
  }

  createRefProps(documentPid) {
    const loanStates = invenioConfig.circulation.loanActiveStates;
    loanStates.push('PENDING');

    const loanRefProps = {
      refType: 'Loan',
      onRefClick: this.handleOnRefClick,
      getRefData: () =>
        loanApi.list(
          loanApi
            .query()
            .withDocPid(documentPid)
            .withState(loanStates)
            .qs()
        ),
    };

    const itemRefProps = {
      refType: 'Items',
      onRefClick: itemPid => openRecordEditor(itemApi.url, itemPid),
      getRefData: () =>
        itemApi.list(
          itemApi
            .query()
            .withDocPid(documentPid)
            .qs()
        ),
    };
    return [loanRefProps, itemRefProps];
  }

  renderHeader(document) {
    return (
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
            deleteHeader={`Are you sure you want to delete the Document
            record with ID ${document.documentPid}?`}
            refProps={this.createRefProps(document.document_pid)}
            onDelete={() => this.deleteDocument(document.documentPid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  prepareData(document) {
    const rows = [
      { name: 'Title', value: document.metadata.title },
      { name: 'Authors', value: document.metadata.authors },
      {
        name: 'Keywords',
        value: this.renderKeywords(document.metadata.keywords),
      },
    ];
    return rows;
  }

  renderPublicAccessRights() {
    return (
      <Segment inverted color="green">
        <Header>
          <Icon name="lock open" />
          Publicly Accessible
        </Header>
      </Segment>
    );
  }

  renderRestrictedAccessRights(readAccessSet) {
    if (readAccessSet.size > 0) {
      const userAccessList = Array.from(readAccessSet).map(email => (
        <Label color="blue" key={email}>
          {email}
        </Label>
      ));
      return (
        <Segment color="yellow">
          <Header>
            <Icon name="lock" />
            Visible only to:
          </Header>
          {userAccessList}
        </Segment>
      );
    } else {
      return null;
    }
  }

  render() {
    const document = this.props.documentDetails;
    const readAccessSet = getReadAccessSet(document);
    const isReadRestricted = !isEmpty(document.metadata._access.read);
    const rows = this.prepareData(document);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(document)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
              {isReadRestricted
                ? this.renderRestrictedAccessRights(readAccessSet)
                : this.renderPublicAccessRights()}
              <DocumentAccessRestrictions
                document={document}
                readAccessSet={readAccessSet}
                maxSelection={1}
              />
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
  documentDetails: PropTypes.object.isRequired,
};

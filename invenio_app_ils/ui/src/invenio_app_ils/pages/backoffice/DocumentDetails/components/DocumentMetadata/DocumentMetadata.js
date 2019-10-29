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
  Divider,
  Popup,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { invenioConfig } from '../../../../../common/config';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton, NewButton } from '../../../components/buttons';
import {
  document as documentApi,
  documentRequest as documentRequestApi,
  loan as loanApi,
  item as itemApi,
  patron as patronApi,
} from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import {
  ESSelectorLoanRequest,
  ESSelectorModal,
} from '../../../../../common/components/ESSelector';
import {
  serializeAccessList,
  serializePatron,
} from '../../../../../common/components/ESSelector/serializer';
import has from 'lodash/has';
import { formatPidTypeToName } from '../../../components/ManageRelationsButton/utils';
import { isEmpty } from 'lodash';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = props.deleteDocument;
    this.documentPid = this.props.documentDetails.metadata.pid;
  }

  getReadAccessList = document => {
    return has(document, 'metadata._access.read')
      ? document.metadata._access.read.map(x =>
          serializeAccessList({ metadata: { email: x } })
        )
      : [];
  };

  updateTags = results => {
    const tagPids = results.map(result => result.metadata.pid);
    this.props.updateDocument(this.documentPid, '/tag_pids', tagPids);
  };

  requestLoan = (
    patronPid,
    { requestEndDate = null, deliveryMethod = null } = {}
  ) => {
    const documentPid = this.props.document.metadata.pid;
    const optionalParams = {};
    if (!isEmpty(requestEndDate)) {
      optionalParams.requestEndDate = requestEndDate;
    }
    if (!isEmpty(deliveryMethod)) {
      optionalParams.deliveryMethod = deliveryMethod;
    }
    this.props.requestLoanForPatron(documentPid, patronPid, optionalParams);
  };

  renderTags(tags) {
    if (!isEmpty(tags)) {
      return (
        <List horizontal>
          {tags.map(tag => (
            <List.Item key={tag.pid}>
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

  handleOnLoanRefClick(loanPid) {
    const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
    window.open(navUrl, `_loan_${loanPid}`);
  }

  handleOnItemRefClick(itemPid) {
    const navUrl = BackOfficeRoutes.itemDetailsFor(itemPid);
    window.open(navUrl, `_item_${itemPid}`);
  }

  handleOnRequestRefClick(docReqPid) {
    const navUrl = BackOfficeRoutes.documentRequestDetailsFor(docReqPid);
    window.open(navUrl, `_document_request_${docReqPid}`);
  }

  async getRelationRefs() {
    const hits = [];
    for (const [relation, records] of Object.entries(this.props.relations)) {
      for (const record of records) {
        const type = formatPidTypeToName(record.pid_type);
        hits.push({
          id: `${type} ${record.pid} (${relation})`,
        });
      }
    }
    const obj = {
      data: {
        hits: hits,
        total: hits.length,
      },
    };
    return obj;
  }

  createRefProps(documentPid) {
    const loanStates = invenioConfig.circulation.loanRequestStates.concat(
      invenioConfig.circulation.loanActiveStates
    );

    const loanRefProps = {
      refType: 'Loan',
      onRefClick: this.handleOnLoanRefClick,
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
      onRefClick: this.handleOnItemRefClick,
      getRefData: () =>
        itemApi.list(
          itemApi
            .query()
            .withDocPid(documentPid)
            .qs()
        ),
    };

    const relationRefProps = {
      refType: 'Related',
      onRefClick: () => {},
      getRefData: () => this.getRelationRefs(),
    };

    const requestRefProps = {
      refType: 'DocumentRequest',
      onRefClick: this.handleOnRequestRefClick,
      getRefData: () =>
        documentRequestApi.list(
          documentRequestApi
            .query()
            .withDocPid(documentPid)
            .qs()
        ),
    };

    return [loanRefProps, itemRefProps, relationRefProps, requestRefProps];
  }

  renderHeader(document) {
    return (
      <Grid.Row>
        <Grid.Column width={9} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{document.pid} - {document.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={7} textAlign="right">
          <NewButton
            text="New item"
            to={{
              pathname: BackOfficeRoutes.itemCreate,
              state: { document },
            }}
          />
          <NewButton
            text="New e-item"
            to={{
              pathname: BackOfficeRoutes.eitemCreate,
              state: { document },
            }}
          />
          <EditButton to={BackOfficeRoutes.documentEditFor(this.documentPid)} />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Document
            record with ID ${document.pid}?`}
            refProps={this.createRefProps(document.pid)}
            onDelete={() => this.deleteDocument(document.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
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

  renderPublicAccessRights(readAccessSet) {
    if (!readAccessSet.length) {
      return (
        <Label
          icon="lock open"
          size="large"
          color="green"
          content="Publicly Accessible"
        />
      );
    } else {
      return null;
    }
  }

  renderRestrictedAccessRights(readAccessSet) {
    if (readAccessSet.length > 0) {
      const userAccessList = readAccessSet.map(patron => (
        <Label color="blue" key={patron.title} content={patron.title} />
      ));
      return (
        <Segment color="yellow">
          <Header>
            <Icon name="lock" />
            The document can be read by:
          </Header>
          {userAccessList}
        </Segment>
      );
    } else {
      return null;
    }
  }

  setRestrictions = selections => {
    const selectedIds = selections.map(selection =>
      selection.title.toLowerCase()
    );
    this.props.setRestrictionsOnDocument(this.documentPid, selectedIds);
  };

  requestLoanButton = (
    <div>
      <Button
        positive
        icon="add"
        labelPosition="left"
        size="small"
        content="New Loan Request"
      />
      <Popup
        content="Request a loan on this document on behalf of a patron"
        trigger={<Icon name="info circle" size="large" />}
      />
    </div>
  );

  onSelectPatronResult = result => {
    const email = result.id.toLowerCase();
    result.metadata = { email: email };
    result.id = email;
    result.key = email;
    result.title = email;
  };

  render() {
    const document = this.props.documentDetails;
    const readAccessSet = this.getReadAccessList(document);
    const rows = this.prepareData(document);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(document)}
          <ESSelectorLoanRequest
            trigger={this.requestLoanButton}
            query={patronApi.list}
            serializer={serializePatron}
            title={`Request a loan for document ${document.pid}`}
            content={
              'Search for the patron to whom the loan should be assigned'
            }
            selectionInfoText={
              'The loan will be assigned to the following patron'
            }
            emptySelectionInfoText={'No patrons selected yet'}
            onSave={this.requestLoan}
            saveButtonContent={'Perform request'}
          />
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
              {this.renderRestrictedAccessRights(readAccessSet)}
              {this.renderPublicAccessRights(readAccessSet)}
              <Divider hidden />
              <ESSelectorModal
                multiple
                initialSelections={readAccessSet}
                trigger={
                  <Button
                    icon="privacy"
                    color="yellow"
                    content="Set Access Restrictions"
                    onClick={this.toggleModal}
                  />
                }
                query={patronApi.list}
                serializer={serializeAccessList}
                title={'Modify access restrictions'}
                content={'Search for patrons:'}
                selectionInfoText={
                  'The patron(s) listed below will have read access:'
                }
                emptySelectionInfoText={'Document will be made public'}
                onSave={this.setRestrictions}
                saveButtonContent={'Set access restrictions'}
                onSelectResult={this.onSelectPatronResult}
              />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstract</Header>
                <p>{document.metadata.abstract}</p>
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

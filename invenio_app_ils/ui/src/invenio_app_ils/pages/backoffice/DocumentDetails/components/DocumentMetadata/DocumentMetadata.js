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
import { EditButton } from '../../../components/buttons';
import {
  document as documentApi,
  loan as loanApi,
  item as itemApi,
  keyword as keywordApi,
  patron as patronApi,
} from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import {
  ESSelectorLoanRequest,
  ESSelectorModal,
} from '../../../../../common/components/ESSelector';
import {
  serializeKeyword,
  serializeAccessList,
  serializePatron,
} from '../../../../../common/components/ESSelector/serializer';
import has from 'lodash/has';
import { formatPidTypeToName } from '../../../../../common/components/ManageRelationsButton/utils';
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

  updateKeywords = results => {
    const keywordPids = results.map(result => result.metadata.pid);
    this.props.updateDocument(this.documentPid, '/keyword_pids', keywordPids);
  };

  requestLoan = (results, dateFrom, dateTo, deliveryMethod) => {
    const documentPid = this.props.document.metadata.pid;
    const loanRequestData = {
      metadata: {
        start_date: dateFrom,
        end_date: dateTo,
        document_pid: documentPid,
        patron_pid: results[0].metadata.id.toString(),
        delivery: {
          method: deliveryMethod,
        },
      },
    };
    this.props.requestLoanForDocument(documentPid, loanRequestData);
  };

  renderKeywords(keywords) {
    if (!isEmpty(keywords)) {
      const keywordSelection = keywords.map(keyword =>
        serializeKeyword({ metadata: keyword })
      );
      return (
        <List horizontal>
          {keywords.map(keyword => (
            <List.Item key={keyword.pid}>
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
              trigger={
                <Button basic color="blue" size="small" content="edit" />
              }
              query={keywordApi.list}
              serializer={serializeKeyword}
              title="Select Keywords"
              onSave={this.updateKeywords}
            />
          </List.Item>
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
    const loanStates = invenioConfig.circulation.loanActiveStates;
    loanStates.push('PENDING');

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

    return [loanRefProps, itemRefProps, relationRefProps];
  }

  renderHeader(document) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{document.pid} - {document.metadata.title.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <EditButton
            clickHandler={() => {
              // TODO: EDITOR, implement edit form
            }}
          />
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
      { name: 'Title', value: document.metadata.title.title },
      {
        name: 'Authors',
        value: document.metadata.authors
          .map(author => author.full_name)
          .join(','),
      },
      {
        name: 'Keywords',
        value: this.renderKeywords(document.metadata.keywords),
      },
    ];
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
                <p>{document.metadata.abstracts[0].value}</p>
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

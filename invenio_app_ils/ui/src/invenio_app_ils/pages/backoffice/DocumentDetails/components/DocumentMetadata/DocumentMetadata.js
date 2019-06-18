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
import isEmpty from 'lodash/isEmpty';
import truncate from 'lodash/truncate';
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
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import {
  serializeKeyword,
  serializeAccessList,
} from '../../../../../common/components/ESSelector/serializer';
import has from 'lodash/has';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = props.deleteDocument;
    this.documentPid = this.props.documentDetails.metadata.document_pid;
  }

  getReadAccessList = document => {
    return has(document, 'metadata._access.read')
      ? document.metadata._access.read.map(serializeAccessList)
      : [];
  };

  updateKeywords = results => {
    const keywordPids = results.map(result => result.metadata.keyword_pid);
    this.props.updateDocument(this.documentPid, '/keyword_pids', keywordPids);
  };

  requestLoan = results => {
    const patronPid = results[0].metadata.id.toString();
    this.props.requestLoanForDocument(this.documentPid, patronPid);
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

  renderSeries(series) {
    const bulleted = series.length > 1;
    return (
      <List bulleted={bulleted}>
        {series.map(({ series_pid, title, volume }) => (
          <List.Item key={series_pid}>
            <Link to={BackOfficeRoutes.seriesDetailsFor(series_pid)}>
              {truncate(title, { length: 40 })}
            </Link>
            &nbsp;(vol. {volume || '?'})
          </List.Item>
        ))}
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
            record with ID ${document.document_pid}?`}
            refProps={this.createRefProps(document.document_pid)}
            onDelete={() => this.deleteDocument(document.document_pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  prepareSeries(rows, series) {
    if (!isEmpty(series.serial)) {
      rows.push({
        name: 'Serials',
        value: this.renderSeries(series.serial),
      });
    }
    if (!isEmpty(series.multipart)) {
      rows.push({
        name: 'Multipart Monograph',
        value: this.renderSeries(series.multipart),
      });
    }
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
    if (!isEmpty(document.metadata.series)) {
      this.prepareSeries(rows, document.metadata.series);
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
    result['metadata']['email'] = result['metadata']['email'].toLowerCase();
    result['id'] = result['metadata']['email'];
    result['title'] = result['metadata']['email'];
  };

  render() {
    const document = this.props.documentDetails;
    const readAccessSet = this.getReadAccessList(document);
    const rows = this.prepareData(document);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(document)}
          <ESSelectorModal
            trigger={this.requestLoanButton}
            query={patronApi.list}
            title={`Request a loan for document ${document.document_pid}`}
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
                    content="Set Acccess Restrictions"
                    onClick={this.toggleModal}
                  />
                }
                query={patronApi.list}
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

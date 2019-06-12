import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Label,
  List,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import truncate from 'lodash/truncate';
import { MetadataTable } from '../../../components';
import { EditButton } from '../../../components/buttons';
import { invenioConfig } from '../../../../../common/config';
import {
  document as documentApi,
  item as itemApi,
  loan as loanApi,
  keyword as keywordApi,
} from '../../../../../common/api';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import { serializeKeyword } from '../../../../../common/components/ESSelector/serializer';
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import { DocumentAccessRestrictions } from '../DocumentAccessRestrictions';

const getReadAccessSet = data => {
  if (data.metadata._access && data.metadata._access.read) {
    return new Set(data.metadata._access.read);
  } else return new Set([]);
};

const createRefProps = documentPid => {
  const loanStates = invenioConfig.circulation.loanActiveStates;
  loanStates.push('PENDING');

  const loanRefProps = {
    refType: 'Loan',
    onRefClick: loanPid => {
      const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
      window.open(navUrl, `_loan_${loanPid}`);
    },
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
};

const renderSeries = series => {
  const bulleted = series.length > 1;
  return (
    <List bulleted={bulleted}>
      {series.map(({ series_pid: seriesPid, title, volume }) => (
        <List.Item key={seriesPid}>
          <Link to={BackOfficeRoutes.seriesDetailsFor(seriesPid)}>
            {truncate(title, { length: 40 })}
          </Link>
          &nbsp;(vol. {volume || '?'})
        </List.Item>
      ))}
    </List>
  );
};

export default class DocumentDetails extends Component {
  updateKeywords = results => {
    const documentPid = this.props.documentDetails.metadata.document_pid;
    const keywordPids = results.map(result => result.metadata.keyword_pid);
    this.props.updateDocument(documentPid, '/keyword_pids', keywordPids);
  };

  renderKeywords = keywords => {
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
  };

  renderHeader = data => {
    return (
      <Grid.Row>
        <Grid.Column width={14} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{data.document_pid} - {data.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={2} textAlign={'right'}>
          <EditButton
            clickHandler={() =>
              openRecordEditor(documentApi.url, data.document_pid)
            }
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Document
            record with ID ${document.documentPid}?`}
            refProps={createRefProps(document.document_pid)}
            onDelete={() => this.props.deleteDocument(document.documentPid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  };

  prepareData = data => {
    const rows = [
      { name: 'Title', value: data.metadata.title },
      { name: 'Authors', value: data.metadata.authors },
      {
        name: 'Keywords',
        value: this.renderKeywords(data.metadata.keywords),
      },
    ];
    if (!isEmpty(data.metadata.series)) {
      this.prepareSeries(rows, data.metadata.series);
    }
    return rows;
  };

  prepareSeries(rows, series) {
    if (!isEmpty(series.serial)) {
      rows.push({
        name: 'Serials',
        value: renderSeries(series.serial),
      });
    }
    if (!isEmpty(series.multipart)) {
      rows.push({
        name: 'Multipart Monograph',
        value: renderSeries(series.multipart),
      });
    }
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

  render() {
    const { data } = this.props;
    const readAccessSet = getReadAccessSet(data);
    const isReadRestricted =
      !isEmpty(data.metadata._access) && !isEmpty(data.metadata._access.read);
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(data)}
          <Grid.Row>
            <Grid.Column>
              {isReadRestricted
                ? this.renderRestrictedAccessRights(readAccessSet)
                : this.renderPublicAccessRights()}
              <MetadataTable rows={this.prepareData(data)} />
              <DocumentAccessRestrictions
                document={data}
                readAccessSet={readAccessSet}
                maxSelection={1}
              />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstract</Header>
                <p>{data.metadata.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentDetails.propTypes = {
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

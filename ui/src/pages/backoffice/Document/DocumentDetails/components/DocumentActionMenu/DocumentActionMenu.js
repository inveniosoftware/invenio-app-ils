import {
  documentRequest as documentRequestApi,
  item as itemApi,
  loan as loanApi,
  patron as patronApi,
} from '@api';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import PropTypes from 'prop-types';
import { ESSelectorLoanRequest } from '@components/ESSelector';
import { serializePatron } from '@components/ESSelector/serializer';
import { invenioConfig } from '@config';
import { EditButton, NewButton } from '@pages/backoffice';
import { DeleteRecordModal } from '@pages/backoffice/components/DeleteRecordModal';
import { formatPidTypeToName } from '@pages/backoffice/components/ManageRelationsButton/utils';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';
import React from 'react';
import { Button, Divider } from 'semantic-ui-react';

const deleteDocButton = props => {
  return (
    <DeleteButton
      fluid
      content="Delete document"
      labelPosition="left"
      {...props}
    />
  );
};

export default class DocumentActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;

    this.documentPid = props.document.metadata.pid;
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

  requestLoanButton = (
    <div>
      {/* THIS DIV MUST be here, without it the trigger does not work */}
      <Button
        positive
        icon="add"
        labelPosition="left"
        size="small"
        fluid
        content="New loan request"
      />
    </div>
  );

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

  scrollTo(ref, menuItemName) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth', block: 'end' });
    this.setState({ activeItem: menuItemName });
  }

  render() {
    const { document } = this.props;

    return (
      <div className={'bo-action-menu'}>
        <EditButton
          fluid
          to={BackOfficeRoutes.documentEditFor(document.metadata.pid)}
          text="Edit document"
        />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the Document
            record with ID ${document.metadata.pid}?`}
          refProps={this.createRefProps(document.metadata.pid)}
          onDelete={() => this.deleteDocument(document.metadata.pid)}
          trigger={deleteDocButton}
        />

        <Divider horizontal>Create</Divider>

        <NewButton
          text="New physical copy"
          fluid
          to={{
            pathname: BackOfficeRoutes.itemCreate,
            state: { document },
          }}
        />
        <NewButton
          text="New E-item"
          fluid
          to={{
            pathname: BackOfficeRoutes.eitemCreate,
            state: { document },
          }}
        />

        <ESSelectorLoanRequest
          trigger={this.requestLoanButton}
          query={patronApi.list}
          serializer={serializePatron}
          title={`Request a loan for document ${document.pid} on behalf of patron`}
          content={'Search for the patron to whom the loan should be assigned'}
          selectionInfoText={
            'The loan will be assigned to the following patron'
          }
          emptySelectionInfoText={'No patrons selected yet'}
          onSave={this.requestLoan}
          saveButtonContent={'Perform request'}
        />

        <Divider horizontal>Navigation</Divider>
      </div>
    );
  }
}

DocumentActionMenu.propTypes = {
  anchors: PropTypes.array,
  deleteDocument: PropTypes.func.isRequired,
  relations: PropTypes.object.isRequired,
};

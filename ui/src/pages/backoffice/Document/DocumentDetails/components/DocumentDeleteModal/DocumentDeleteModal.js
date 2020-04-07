import {
  documentRequest as documentRequestApi,
  item as itemApi,
  loan as loanApi,
} from '@api';
import { invenioConfig } from '@config';
import { DeleteRecordModal } from '@pages/backoffice/components';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { formatPidTypeToName } from '@pages/backoffice/components/utils';
import { BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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

export default class DocumentDeleteModal extends Component {
  async getRelationRefs() {
    const hits = [];
    for (const [relation, records] of Object.entries(this.props.relations)) {
      for (const record of records) {
        const type = formatPidTypeToName(record.pid_type);
        hits.push({
          id: `${type} ${record.pid} (${relation})`,
          record: record,
          type: type,
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
  /**
   * Used to create all the references for de
   */
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

  render() {
    const { document } = this.props;
    return (
      <DeleteRecordModal
        deleteHeader={`Are you sure you want to delete the Document
            record with ID ${document.metadata.pid}?`}
        refProps={this.createRefProps(document.metadata.pid)}
        onDelete={() => this.props.deleteDocument(document.metadata.pid)}
        trigger={deleteDocButton}
      />
    );
  }
}

DocumentDeleteModal.propTypes = {
  document: PropTypes.object.isRequired,
  relations: PropTypes.object.isRequired,
  deleteDocument: PropTypes.func.isRequired,
};

import { patron as patronApi } from '@api';
import { ESSelectorLoanRequest } from '@components/ESSelector';
import { serializePatron } from '@components/ESSelector/serializer';
import { EditButton, LoanIcon, NewButton } from '@pages/backoffice/components';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import { DocumentDeleteModal } from '@pages/backoffice/Document/DocumentDetails/components/';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';

export default class DocumentActionMenu extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;

    this.documentPid = props.document.metadata.pid;
    this.state = { activeItem: '' };
  }

  requestLoanButton = (
    <div>
      {/* THIS DIV MUST be here, without it the trigger does not work */}
      <Button positive icon labelPosition="left" size="small" fluid>
        <LoanIcon />
        Request loan for a patron
      </Button>
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

  render() {
    const { document, relations } = this.props;
    return (
      <div className={'bo-action-menu'}>
        <EditButton
          fluid
          to={BackOfficeRoutes.documentEditFor(document.metadata.pid)}
          text="Edit document"
        />
        <DocumentDeleteModal relations={relations} document={document} />
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
        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem elementId="metadata" label="Metadata" />
          <ScrollingMenuItem elementId="loan-requests" label="Loan requests" />
          <ScrollingMenuItem
            elementId="document-items"
            label="Physical items"
          />
          <ScrollingMenuItem
            elementId="document-eitems"
            label="Electronic items"
          />
          <ScrollingMenuItem elementId="document-series" label="Series" />
          <ScrollingMenuItem elementId="document-siblings" label="Related" />
          <ScrollingMenuItem
            elementId="document-statistics"
            label="Statistics"
          />
        </ScrollingMenu>
      </div>
    );
  }
}

DocumentActionMenu.propTypes = {
  anchors: PropTypes.object,
  deleteDocument: PropTypes.func.isRequired,
  relations: PropTypes.object.isRequired,
};

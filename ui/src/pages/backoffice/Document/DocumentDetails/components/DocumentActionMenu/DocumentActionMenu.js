import { patron as patronApi } from '@api';
import { DocumentDeleteModal } from '@pages/backoffice/Document/DocumentDetails/components/';
import PropTypes from 'prop-types';
import { ESSelectorLoanRequest } from '@components/ESSelector';
import { serializePatron } from '@components/ESSelector/serializer';
import { EditButton, LoanIcon, NewButton } from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Button, Divider, Menu } from 'semantic-ui-react';

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

  scrollTo(ref, menuItemName) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth', block: 'end' });
    this.setState({ activeItem: menuItemName });
  }

  render() {
    const { document, relations, anchors } = this.props;
    const { activeItem } = this.state;
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

        <Menu pointing secondary vertical fluid className="left">
          <Menu.Item
            name="header"
            active={activeItem === 'header'}
            onClick={(e, { name }) => this.scrollTo(anchors.summaryRef, name)}
          >
            Metadata
          </Menu.Item>
          <Menu.Item
            name="loan-requests"
            active={activeItem === 'loan-requests'}
            onClick={(e, { name }) =>
              this.scrollTo(anchors.loanRequestsRef, name)
            }
          >
            Loan requests
          </Menu.Item>
          <Menu.Item
            name="document-items'"
            active={activeItem === 'document-items'}
            onClick={(e, { name }) =>
              this.scrollTo(anchors.attachedItemsRef, name)
            }
          >
            Physical items
          </Menu.Item>
          <Menu.Item
            name="document-eitems"
            active={activeItem === 'document-eitems'}
            onClick={(e, { name }) =>
              this.scrollTo(anchors.attachedEItemsRef, name)
            }
          >
            Electronic items
          </Menu.Item>
          <Menu.Item
            name="document-series"
            active={activeItem === 'document-series'}
            onClick={(e, { name }) => this.scrollTo(anchors.seriesRef, name)}
          >
            Series
          </Menu.Item>
          <Menu.Item
            name="document-siblings"
            active={activeItem === 'document-siblings'}
            onClick={(e, { name }) => this.scrollTo(anchors.relatedRef, name)}
          >
            Related
          </Menu.Item>
          <Menu.Item
            name="document-statistics"
            active={activeItem === 'document-statistics'}
            onClick={(e, { name }) =>
              this.scrollTo(anchors.statisticsRef, name)
            }
          >
            Statistics
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

DocumentActionMenu.propTypes = {
  anchors: PropTypes.object,
  deleteDocument: PropTypes.func.isRequired,
  relations: PropTypes.object.isRequired,
};

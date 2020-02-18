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
import { Link as ScrollLink } from 'react-scroll';

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
    const { activeItem } = this.state;
    const offset = -250;
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
            name="metadata"
            active={activeItem === 'metadata'}
            activeClass="active"
            as={ScrollLink}
            to={'metadata'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'metadata' })}
            offset={offset}
          >
            Metadata
          </Menu.Item>

          <Menu.Item
            name="loan-requests"
            active={activeItem === 'loan-requests'}
            activeClass="active"
            as={ScrollLink}
            to={'loan-requests'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'loan-requests' })}
            offset={offset}
          >
            Loan requests
          </Menu.Item>
          <Menu.Item
            name="document-items"
            active={activeItem === 'document-items'}
            activeClass="active"
            as={ScrollLink}
            to={'document-items'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'document-items' })}
            offset={offset}
          >
            Physical items
          </Menu.Item>
          <Menu.Item
            name="document-eitems"
            active={activeItem === 'document-eitems'}
            activeClass="active"
            as={ScrollLink}
            to={'document-eitems'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'document-eitems' })}
            offset={offset}
          >
            Electronic items
          </Menu.Item>
          <Menu.Item
            name="document-series"
            active={activeItem === 'document-series'}
            activeClass="active"
            as={ScrollLink}
            to={'document-series'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'document-series' })}
            offset={offset}
          >
            Series
          </Menu.Item>
          <Menu.Item
            name="document-siblings"
            active={activeItem === 'document-siblings'}
            activeClass="active"
            as={ScrollLink}
            to={'document-siblings'}
            spy={true}
            onSetActive={() =>
              this.setState({ activeItem: 'document-siblings' })
            }
            offset={offset}
          >
            Related
          </Menu.Item>
          <Menu.Item
            name="document-statistics"
            active={activeItem === 'document-statistics'}
            activeClass="active"
            as={ScrollLink}
            to={'document-statistics'}
            spy={true}
            onSetActive={() =>
              this.setState({ activeItem: 'document-statistics' })
            }
            offset={offset}
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

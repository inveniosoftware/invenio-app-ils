import { loan as loanApi, patron as patronApi } from '@api';
import { recordToPidType } from '@api/utils';
import { ESSelectorModal } from '@components/ESSelector';
import { serializePatron } from '@components/ESSelector/serializer';
import { invenioConfig } from '@config';
import {
  DeleteRecordModal,
  EditButton,
  LoanIcon,
} from '@pages/backoffice/components';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';

export default class ItemActionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: '' };
  }

  handleOnRefClick(loanPid) {
    const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
    window.open(navUrl, `_loan_${loanPid}`);
  }

  createRefProps(itemPid) {
    return [
      {
        refType: 'Loan',
        onRefClick: this.handleOnRefClick,
        getRefData: () =>
          loanApi.list(
            loanApi
              .query()
              .withItemPid(itemPid)
              .withState(invenioConfig.circulation.loanActiveStates)
              .qs()
          ),
      },
    ];
  }

  checkoutItemButton = (
    <Button
      positive
      icon
      fluid
      labelPosition="left"
      size="small"
      onClick={() => this.setState({ open: true })}
      disabled={
        invenioConfig.circulation.loanActiveStates.includes(
          this.props.item.metadata.circulation.state
        ) ||
        !invenioConfig.items.canCirculateStatuses.includes(
          this.props.item.metadata.status
        )
      }
    >
      <LoanIcon />
      Checkout this copy
    </Button>
  );

  deleteDocButton = props => {
    return (
      <DeleteButton
        fluid
        content="Delete physical copy"
        labelPosition="left"
        {...props}
      />
    );
  };

  checkoutItem = results => {
    const documentPid = this.props.item.metadata.document_pid;
    const itemPid = {
      type: recordToPidType(this.props.item),
      value: this.props.item.metadata.pid,
    };
    const patronPid = results[0].metadata.id.toString();
    this.props.checkoutItem(documentPid, itemPid, patronPid);
  };

  render() {
    const { item } = this.props;

    return (
      <div className={'bo-action-menu'}>
        <EditButton
          fluid
          to={BackOfficeRoutes.itemEditFor(item.metadata.pid)}
          text="Edit physical copy"
        />
        <DeleteRecordModal
          trigger={this.deleteDocButton}
          deleteHeader={`Are you sure you want to delete the physical copy
            record with ID ${item.pid}?`}
          onDelete={() => this.props.deleteItem(item.pid)}
          refProps={this.createRefProps(item.pid)}
        />
        <Divider horizontal> Circulation </Divider>
        <ESSelectorModal
          trigger={this.checkoutItemButton}
          query={patronApi.list}
          serializer={serializePatron}
          title={`You are about to checkout the physical copy with barcode ${item.metadata.barcode}.`}
          content={'Search for the patron to whom the loan should be created:'}
          selectionInfoText={
            'The loan will be created for the following patron:'
          }
          emptySelectionInfoText={'No patron selected yet'}
          onSave={this.checkoutItem}
          saveButtonContent={'Checkout physical copy'}
        />
        <Divider horizontal> Navigation </Divider>
        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem label="Circulation" elementId="circulation" />
          <ScrollingMenuItem label="Metadata" elementId="metadata" />
          <ScrollingMenuItem label="Loans history" elementId="loans-history" />
        </ScrollingMenu>
      </div>
    );
  }
}

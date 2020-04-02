import { DeleteRecordModal, EditButton } from '@pages/backoffice/components';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { UploadButton } from '@pages/backoffice/EItem/EItemDetails/components/File';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';

export default class EItemActionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: '' };
  }

  deleteRecordButton = props => {
    return (
      <DeleteButton
        fluid
        content="Delete electronic item"
        labelPosition="left"
        {...props}
      />
    );
  };

  render() {
    const { eitem } = this.props;

    return (
      <div className={'bo-action-menu'}>
        <EditButton
          fluid
          to={BackOfficeRoutes.eitemEditFor(eitem.metadata.pid)}
        />
        <DeleteRecordModal
          trigger={this.deleteRecordButton}
          deleteHeader={`Are you sure you want to delete this electronic item
            with PID ${eitem.metadata.pid}?`}
          onDelete={() => this.props.deleteEItem(eitem.metadata.pid)}
        />
        <Divider horizontal> Files </Divider>
        <UploadButton fluid />

        <Divider horizontal> Navigation </Divider>
        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem label="Metadata" elementId="metadata" />
          <ScrollingMenuItem label="Files" elementId="eitem-files" />
        </ScrollingMenu>
      </div>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Confirm } from 'semantic-ui-react';
import { document as documentApi } from '@api';
import { ESSelectorModal } from '@components/ESSelector';
import { serializeDocument } from '@components/ESSelector/serializer';
import get from 'lodash/get';

export default class RejectAction extends React.Component {
  state = {
    header: null,
    type: null,
    open: false,
  };

  onCancel = () => {
    this.setState({ open: false });
  };

  onConfirm = type => {
    this.setState({ open: false });
    this.props.onReject({ reject_reason: type });
  };

  onRejectWithDocument = selections => {
    this.props.onReject({
      reject_reason: 'IN_CATALOG',
      document_pid: get(selections, '0.id'),
    });
  };

  onClick = (event, { text, value }) => {
    if (value === 'USER_CANCEL') {
      this.setState({
        header: text,
        type: value,
        open: true,
      });
    } else if (value === 'NOT_FOUND') {
      this.setState({
        header: text,
        type: value,
        open: true,
      });
    } else {
      throw new Error(`Invalid reject type: ${value}`);
    }
  };

  render() {
    const options = [
      {
        key: 'USER_CANCEL',
        text: 'Cancelled by the user',
        value: 'USER_CANCEL',
        icon: 'user cancel',
      },
      {
        key: 'IN_CATALOG',
        text: 'Document already in catalog',
        value: 'IN_CATALOG',
        icon: 'search',
      },
      {
        key: 'NOT_FOUND',
        text: 'Document not found in any provider',
        value: 'NOT_FOUND',
        icon: 'minus',
      },
    ];

    return (
      <Dropdown
        text="Reject request"
        icon="cancel"
        floating
        labeled
        button
        className="icon primary"
      >
        <Dropdown.Menu>
          <Confirm
            confirmButton="Reject request"
            content="Are you sure you want to reject this request?"
            header={`Reject: ${this.state.header}`}
            open={this.state.open}
            onCancel={this.onCancel}
            onConfirm={() => this.onConfirm(this.state.type)}
          />
          <Dropdown.Header content="Specify a reject reason" />
          {options.map(option => {
            const dropdown = (
              <Dropdown.Item {...option} onClick={this.onClick} />
            );
            if (option.value === 'IN_CATALOG') {
              return (
                <ESSelectorModal
                  key={option.value}
                  trigger={dropdown}
                  query={documentApi.list}
                  serializer={serializeDocument}
                  title="Reject request: Already in the catalog"
                  content="Select document to attach to the reject."
                  emptySelectionInfoText="No document selected"
                  onSave={this.onRejectWithDocument}
                  saveButtonContent="Reject request"
                />
              );
            }
            return dropdown;
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

RejectAction.propTypes = {
  pid: PropTypes.string.isRequired,
  onReject: PropTypes.func.isRequired,
};

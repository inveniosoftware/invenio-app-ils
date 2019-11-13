import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { ItemForm } from './components';
import get from 'lodash/get';

export class ItemEditor extends Component {
  get initialData() {
    const doc = get(this.props, 'location.state.document', null);
    if (doc) {
      return {
        metadata: {
          document: doc.metadata,
          document_pid: doc.metadata.pid,
        },
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.props.match.params.itemPid) {
      this.props.fetchItemDetails(this.props.match.params.itemPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ItemForm
            pid={pid}
            data={data}
            title="Edit item"
            successSubmitMessage="The item was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { itemPid },
      },
    } = this.props;
    const isEditForm = itemPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(itemPid)
        ) : (
          <ItemForm
            title="Create new item"
            successSubmitMessage="The item was successfully created."
            data={this.initialData}
          />
        )}
      </>
    );
  }
}

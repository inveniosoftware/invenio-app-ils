import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { ItemForm } from './components';

export class ItemEditor extends Component {
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
          />
        )}
      </>
    );
  }
}

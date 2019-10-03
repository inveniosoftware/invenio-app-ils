import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { EItemForm } from './components';

export class EItemEditor extends Component {
  componentDidMount() {
    if (this.props.match.params.eitemPid) {
      this.props.fetchEItemDetails(this.props.match.params.eitemPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <EItemForm
            pid={pid}
            data={data}
            title="Edit eitem"
            successSubmitMessage="Your eitem has been updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { eitemPid },
      },
    } = this.props;
    const isEditForm = eitemPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(eitemPid)
        ) : (
          <EItemForm
            title="Create new eitem"
            successSubmitMessage="Your eitem has been created."
          />
        )}
      </>
    );
  }
}

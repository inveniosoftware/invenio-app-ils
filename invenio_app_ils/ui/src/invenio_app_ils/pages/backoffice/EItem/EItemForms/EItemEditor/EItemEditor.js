import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { EItemForm } from './components';
import get from 'lodash/get';

export class EItemEditor extends Component {
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
            successSubmitMessage="The eitem was successfully updated."
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
            successSubmitMessage="The eitem was successfully created."
            data={this.initialData}
          />
        )}
      </>
    );
  }
}

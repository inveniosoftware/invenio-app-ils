import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { document as documentApi } from '../../../../../common/api/documents/document';
import { DocumentForm } from './components';

export class DocumentEditor extends Component {
  state = {
    data: {},
    isLoading: true,
    error: {},
  };

  fetchDocument = async documentPid => {
    try {
      const response = await documentApi.get(documentPid);
      this.setState({ data: response.data, isLoading: false, error: {} });
    } catch (error) {
      this.setState({ isLoading: false, error: error });
    }
  };

  componentDidMount() {
    if (this.props.match.params.documentPid) {
      this.fetchDocument(this.props.match.params.documentPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.state;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentForm
            pid={pid}
            data={data}
            title="Edit document"
            successSubmitMessage="The document was successfully updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { documentPid },
      },
    } = this.props;
    const isEditForm = documentPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(documentPid)
        ) : (
          <DocumentForm
            title="Create new document"
            successSubmitMessage="The document was successfully created."
          />
        )}
      </>
    );
  }
}

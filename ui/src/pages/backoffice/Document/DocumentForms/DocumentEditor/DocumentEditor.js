import React, { Component } from 'react';
import { Loader, Error } from '@components';
import { document as documentApi } from '@api/documents/document';
import { DocumentForm } from './components';
import _get from 'lodash/get';

export class DocumentEditor extends Component {
  state = {
    data: {},
    isLoading: true,
    error: {},
  };

  get documentRequest() {
    const request = _get(this.props, 'location.state', null);
    if (request) {
      const data = {
        documentRequestPid: request.pid,
        metadata: {
          // NOTE: Cheating so the authors don't break our document form
          authors: [{ full_name: request.metadata.authors, type: 'PERSON' }],
          edition: _get(request, 'metadata.edition', ''),
          journal_title: _get(request, 'metadata.journal_title', ''),
          title: request.metadata.title,
        },
      };
      const pubYear = _get(request, 'metadata.publication_year', null);
      if (pubYear) data.metadata.publication_info = [{ year: pubYear }];
      return data;
    }
    return null;
  }

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
            data={this.documentRequest}
          />
        )}
      </>
    );
  }
}

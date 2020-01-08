import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import _get from 'lodash/get';
import prettyBytes from 'pretty-bytes';
import { Icon, Message } from 'semantic-ui-react';
import { file as fileApi } from '@api';
import { DownloadButton } from '@pages/backoffice/components/buttons';
import UploadButton from './UploadButton';
import { invenioConfig } from '@config';
import DeleteRecordModal from '@pages/backoffice/components/DeleteRecordModal/DeleteRecordModal';

export default class EItemFiles extends Component {
  constructor(props) {
    super(props);
    this.maxFiles = invenioConfig.eitems.maxFiles;
  }

  onDelete = row => {
    this.props.deleteFile(row.bucket, row.key);
  };

  onSelectFile = file => {
    if (this.props.files.length >= this.maxFiles) {
      this.props.sendErrorNotification(
        'Failed to upload file',
        `An e-item cannot have more than ${this.maxFiles} files.`
      );
    } else {
      const { eitemDetails } = this.props;
      const pid = eitemDetails.pid;
      const bucket = eitemDetails.metadata.bucket_id;
      this.props.uploadFile(pid, bucket, file);
    }
  };

  actionsFormatter = ({ row }) => {
    const downloadUrl = fileApi.downloadURL(row.bucket, row.key);
    return (
      <>
        <DownloadButton to={downloadUrl} />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the file "${row.key}"?`}
          onDelete={() => this.onDelete(row)}
        />
      </>
    );
  };

  prepareData(files) {
    return files.map(file => ({
      id: file.key,
      ...file,
    }));
  }

  filenameFormatter = ({ row }) => {
    const filename = row.key;
    const extension = filename
      .split('.')
      .pop()
      .toLowerCase();
    let icon = 'file outline';
    if (extension === 'pdf') {
      icon = 'file pdf outline';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      icon = 'file image outline';
    } else if (['doc', 'docx', 'odt', 'txt'].includes(extension)) {
      icon = 'file alternate outline';
    } else if (['zip', 'tar', 'gz', 'bz2', 'rar'].includes(extension)) {
      icon = 'file archive outline';
    }
    return (
      <>
        <Icon name={icon} />
        {filename}
      </>
    );
  };

  renderEmptyResults() {
    return (
      <Message info icon data-test="no-results">
        <Message.Content>
          <Message.Header>No attached files</Message.Header>
          Upload a file to attach it to the E-Item.
        </Message.Content>
      </Message>
    );
  }

  renderTable(data) {
    const columns = [
      {
        title: 'Filename',
        field: 'key',
        formatter: this.filenameFormatter,
      },
      {
        title: 'Size',
        field: 'size',
        formatter: ({ row, col }) => {
          const value = _get(row, col.field);
          return value ? prettyBytes(value) : '-';
        },
      },
      { title: 'Version ID', field: 'version_id' },
      {
        title: '',
        formatter: this.actionsFormatter,
      },
    ];
    return (
      <ResultsTable
        data={data}
        columns={columns}
        totalHitsCount={data.length}
        title={'Attached files'}
        showMaxRows={this.maxFiles}
        renderEmptyResultsElement={this.renderEmptyResults}
      />
    );
  }

  render() {
    const { files, isFilesLoading, error } = this.props;
    return (
      <Loader isLoading={isFilesLoading}>
        <Error error={error}>
          {this.renderTable(this.prepareData(files))}
          <UploadButton onSelectFile={this.onSelectFile} />
        </Error>
      </Loader>
    );
  }
}

EItemFiles.propTypes = {
  eitemDetails: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  errors: PropTypes.object,
  isFilesLoading: PropTypes.bool,
};

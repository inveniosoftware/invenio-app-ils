import { file as fileApi } from '@api';
import { Error, Loader, ResultsTable } from '@components';
import { invenioConfig } from '@config';
import { InfoMessage } from '@pages/backoffice/components';
import { DownloadButton } from '@pages/backoffice/components/buttons';
import DeleteRecordModal from '@pages/backoffice/components/DeleteRecordModal/DeleteRecordModal';
import _get from 'lodash/get';
import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

export default class EItemFiles extends Component {
  constructor(props) {
    super(props);
    this.maxFiles = invenioConfig.eitems.maxFiles;
  }

  onDelete = row => {
    this.props.deleteFile(row.bucket, row.key);
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

  tableColumns() {
    return [
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
  }

  render() {
    const { files, isFilesLoading, error } = this.props;
    return (
      <>
        <Header as="h3" attached="top">
          Files
        </Header>
        <Segment
          attached
          className="bo-metadata-segment no-padding"
          id="eitem-files"
        >
          <Loader isLoading={isFilesLoading}>
            <Error error={error}>
              <ResultsTable
                data={files}
                columns={this.tableColumns()}
                totalHitsCount={files.length}
                showMaxRows={this.maxFiles}
                renderEmptyResultsElement={() => (
                  <InfoMessage
                    content="Upload a file to attach it to this electronic item"
                    header="No uploaded files"
                  />
                )}
              />
            </Error>
          </Loader>
        </Segment>
      </>
    );
  }
}

EItemFiles.propTypes = {
  eitemDetails: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  errors: PropTypes.object,
  isFilesLoading: PropTypes.bool,
};

import React from 'react';
import { Button } from 'semantic-ui-react';

export default class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.filesRef = React.createRef();
  }

  onChange = event => {
    const file = this.filesRef.current.files[0];
    if (file) {
      this.onSelectFile(file);
    }
  };

  onSelectFile = async file => {
    if (this.props.files.length >= this.maxFiles) {
      this.props.sendErrorNotification(
        'Failed to upload file',
        `An e-item cannot have more than ${this.maxFiles} files.`
      );
    } else {
      const { eitem } = this.props;
      const pid = eitem.pid;
      const bucket = eitem.metadata.bucket_id;
      await this.props.uploadFile(pid, bucket, file);
    }
  };

  render() {
    const { isFilesLoading, fluid } = this.props;
    return (
      <label htmlFor="upload">
        <Button
          primary
          disabled={isFilesLoading}
          loading={isFilesLoading}
          as="a"
          icon="cloud upload"
          content="Upload file"
          labelPosition="left"
          fluid={fluid}
        />
        <input
          hidden
          ref={this.filesRef}
          id="upload"
          type="file"
          onChange={this.onChange}
        />
      </label>
    );
  }
}

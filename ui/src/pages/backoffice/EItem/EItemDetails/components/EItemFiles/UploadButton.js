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
      this.props.onSelectFile(file);
    }
  };

  render() {
    return (
      <label htmlFor="upload">
        <Button
          primary
          as="a"
          icon="cloud upload"
          content="Upload file"
          labelPosition="left"
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

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export class CopyButton extends React.Component {
  onCopy = () => {
    this.props.onCopy(this.props.text);
  };

  render() {
    return (
      <CopyToClipboard text={this.props.text} onCopy={this.onCopy}>
        <Button className="copy" basic icon="copy" />
      </CopyToClipboard>
    );
  }
}

CopyButton.propTypes = {
  onCopy: PropTypes.func,
  text: PropTypes.string.isRequired,
};

CopyButton.defaultProps = {
  onCopy: () => {},
};

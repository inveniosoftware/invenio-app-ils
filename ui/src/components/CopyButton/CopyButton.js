import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export class CopyButton extends React.Component {
  render() {
    return (
      <CopyToClipboard
        text={this.props.text}
        onCopy={() => {
          this.props.onCopy(this.props.text);
        }}
      >
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

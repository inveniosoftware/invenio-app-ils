import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class SimpleCopyButton extends React.Component {
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

export class CopyButton extends Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      confirmationPopupIsOpen: false,
      confirmationPopupMsg: '',
    };
    this.state = this.INITIAL_STATE;
    this.contextRef = React.createRef();
  }

  onCopy = () => {
    this.setState(() => ({
      confirmationPopupIsOpen: true,
      confirmationPopupMsg: 'Copied!',
    }));
    this.delayClosePopup();
  };

  delayClosePopup = () => {
    this.timeout = setTimeout(() => {
      this.setState(this.INITIAL_STATE);
    }, 1500);
  };

  render() {
    const { text, popUpPosition } = this.props;
    return text ? (
      <>
        <Popup
          content={this.state.confirmationPopupMsg}
          context={this.contextRef}
          inverted
          open={this.state.confirmationPopupIsOpen}
          position={popUpPosition}
          size="mini"
        />
        <Popup
          content="Copy to clipboard"
          position={popUpPosition}
          size="mini"
          trigger={
            <span ref={this.contextRef}>
              <SimpleCopyButton text={text} onCopy={this.onCopy} />
            </span>
          }
        />
      </>
    ) : null;
  }
}

CopyButton.propTypes = {
  popUpPosition: PropTypes.string,
  text: PropTypes.string,
};

CopyButton.defaultProps = {
  popUpPosition: 'right center',
  text: '',
};

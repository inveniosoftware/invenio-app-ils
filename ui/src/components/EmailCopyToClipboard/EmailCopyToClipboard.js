import React, { Component } from 'react';
import { Popup } from 'semantic-ui-react';
import { CopyButton } from '@components';

export class EmailCopyToClipboard extends Component {
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
      confirmationPopupMsg: 'E-mail copied!',
    }));
    this.delayClosePopup();
  };

  delayClosePopup = () => {
    this.timeout = setTimeout(() => {
      this.setState(this.INITIAL_STATE);
    }, 1500);
  };

  render() {
    const { email } = this.props;
    return (
      <>
        <Popup
          content={this.state.confirmationPopupMsg}
          context={this.contextRef}
          inverted
          open={this.state.confirmationPopupIsOpen}
          position="right center"
          size="mini"
        />
        <Popup
          content="Copy e-mail to clipboard"
          position="right center"
          size="mini"
          trigger={
            <span ref={this.contextRef}>
              <CopyButton text={email} onCopy={this.onCopy} />
            </span>
          }
        />
      </>
    );
  }
}

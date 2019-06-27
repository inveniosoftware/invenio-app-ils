import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

export class ShareButtons extends Component {
  constructor(props) {
    super(props);
    this.type = props.type;
  }

  renderShareButtonsDesktop() {
    return (
      <div>
        <Button
          href="https://www.facebook.com/sharer/sharer.php"
          color="facebook"
          icon="facebook"
          content="Facebook"
        />
        <div className="ui hidden divider" />
        <Button
          href="https://twitter.com/intent/tweet"
          color="twitter"
          icon="twitter"
          content="Twitter"
        />
        <div className="ui hidden divider" />
        <Button color="linkedin" icon="linkedin" content="LinkedIn" />
      </div>
    );
  }

  renderShareButtonsMobile() {
    return (
      <div>
        <Button
          href="https://www.facebook.com/sharer/sharer.php"
          circular
          color="facebook"
          icon="facebook"
        />
        <Button
          href="https://twitter.com/intent/tweet"
          circular
          color="twitter"
          icon="twitter"
        />
        <Button circular color="linkedin" icon="linkedin" />
      </div>
    );
  }

  render() {
    switch (this.type) {
      case 'desktop':
        return this.renderShareButtonsDesktop();
      case 'mobile':
        return this.renderShareButtonsMobile();
    }
  }
}

ShareButtons.propTypes = {
  type: PropTypes.string.isRequired,
};

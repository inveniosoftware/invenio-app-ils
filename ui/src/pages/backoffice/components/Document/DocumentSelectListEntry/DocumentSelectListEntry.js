import { DocumentTitle, DocumentAuthors } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

export default class DocumentSelectListEntry extends Component {
  render() {
    const { document, disabled, description } = this.props;
    return (
      <div
        key={document.metadata.pid}
        className={disabled ? 'select-disabled' : ''}
      >
        <div className="price">PID #{document.metadata.pid}</div>
        <div className="title">
          {disabled && (
            <Popup
              content="This document was already selected."
              trigger={<Icon name="info circle" />}
            />
          )}
          <DocumentTitle document={document} />
        </div>
        <div className="description">
          {description ? (
            description
          ) : (
            <DocumentAuthors metadata={document.metadata} />
          )}
        </div>
      </div>
    );
  }
}

DocumentSelectListEntry.propTypes = {
  disabled: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  description: PropTypes.node,
};

DocumentSelectListEntry.defaultProps = {
  disabled: false,
};

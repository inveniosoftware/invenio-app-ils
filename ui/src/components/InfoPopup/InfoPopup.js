import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';

export const InfoPopup = ({ children, message }) => {
  return (
    <Popup
      content={message}
      trigger={
        <span className="info-popup">
          {children}
          <Icon color="grey" name="question circle outline" />
        </span>
      }
    />
  );
};

InfoPopup.propTypes = {
  children: PropTypes.node,
  message: PropTypes.node.isRequired,
};

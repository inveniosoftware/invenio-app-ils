import React from 'react';

export const DocumentEdition = ({ document }) => {
  return document.metadata.edition ? `ed.  ${document.metadata.edition}, ` : '';
};

import React from 'react';

export const DocumentEdition = ({ document, label }) => {
  if (label) {
    return (
      <>
        <label>edition</label> {document.metadata.edition}
      </>
    );
  } else {
    return document.metadata.edition
      ? `ed.  ${document.metadata.edition}, `
      : '';
  }
};

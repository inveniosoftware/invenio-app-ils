import React from 'react';

export const DocumentEdition = ({ document, label }) => {
  const documentMetadata = document.metadata ? document.metadata : document;

  if (label) {
    return (
      <>
        <label>edition</label> {documentMetadata.edition}
      </>
    );
  } else {
    return documentMetadata.edition ? `ed.  ${documentMetadata.edition}, ` : '';
  }
};

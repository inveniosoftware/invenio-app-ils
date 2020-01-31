import React from 'react';
import { Item } from 'semantic-ui-react';

export const DocumentEdition = ({ document, explicit }) => {
  if (explicit) {
    return (
      <Item.Description>
        <label>edition</label> {document.metadata.edition}
      </Item.Description>
    );
  } else {
    return document.metadata.edition
      ? `ed.  ${document.metadata.edition}, `
      : '';
  }
};

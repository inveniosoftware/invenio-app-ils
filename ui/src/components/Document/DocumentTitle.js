import { DocumentEdition } from '@components/Document';
import React from 'react';

export const DocumentTitle = ({ document }) => {
  return (
    <>
      {document.metadata.title} (<DocumentEdition document={document} />
      {document.metadata.publication_year})
    </>
  );
};

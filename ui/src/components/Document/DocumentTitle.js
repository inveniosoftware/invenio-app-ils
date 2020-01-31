import { DocumentEdition } from '@components/Document';
import React from 'react';
import Truncate from 'react-truncate';

export const DocumentTitle = ({ document, short, truncate }) => {
  if (short) {
    return <div className="document-title">{document.metadata.title}</div>;
  }
  if (truncate) {
    return (
      <Truncate lines={2} ellipsis={'... '} className="document-title">
        {document.metadata.title}
      </Truncate>
    );
  }
  return (
    <div className="document-title">
      {document.metadata.title} (<DocumentEdition document={document} />
      {document.metadata.publication_year})
    </div>
  );
};

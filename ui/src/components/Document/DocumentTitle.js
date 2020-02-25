import { DocumentEdition } from '@components/Document';
import React from 'react';
import Truncate from 'react-truncate';

export const DocumentTitle = ({ document, short, truncate }) => {
  const documentMetadata = document.metadata ? document.metadata : document;
  const title = short ? (
    documentMetadata.title
  ) : (
    <>
      {documentMetadata.title} (<DocumentEdition document={document} />{' '}
      {documentMetadata.publication_year})
    </>
  );

  const cmp = <div className="document-title">{title}</div>;

  return truncate ? (
    <Truncate lines={2} ellipsis={'... '}>
      {cmp}
    </Truncate>
  ) : (
    cmp
  );
};

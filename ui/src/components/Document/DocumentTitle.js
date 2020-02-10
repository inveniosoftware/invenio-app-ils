import { DocumentEdition } from '@components/Document';
import React from 'react';
import Truncate from 'react-truncate';

export const DocumentTitle = ({ document, short, truncate }) => {
  const title = short ? (
    document.metadata.title
  ) : (
    <>
      {document.metadata.title} (<DocumentEdition document={document} />{' '}
      {document.metadata.publication_year})
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

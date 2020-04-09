import { DocumentEdition } from '@components/Document';
import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import _get from 'lodash/get';

const EditionTitleCmp = ({ metadata }) => {
  const edition = _get(metadata, 'edition');
  const year = _get(metadata, 'publication_year');
  /* render both edition and year, or only edition, or only year or nothing
   * title (edition - year)
   * title (edition)
   * title (year)
   * title
   */
  const editionYearCmp =
    edition && year ? (
      <>
        {'('}
        <DocumentEdition metadata={metadata} /> - {year}
        {')'}
      </>
    ) : edition ? (
      <>
        {'('}
        <DocumentEdition metadata={metadata} />
        {')'}
      </>
    ) : year ? (
      `(${year})`
    ) : (
      ''
    );
  return editionYearCmp;
};

export const DocumentTitle = ({ metadata, titleOnly, truncate }) => {
  const title = _get(metadata, 'title', 'No title set!');

  let titleCmp;
  if (titleOnly) {
    titleCmp = title;
  } else {
    titleCmp = (
      <>
        {title} <EditionTitleCmp metadata={metadata} />
      </>
    );
  }

  const cmp = <div className="document-title">{titleCmp}</div>;

  return truncate ? <Truncate ellipsis={'... '}>{cmp}</Truncate> : cmp;
};

DocumentTitle.propTypes = {
  metadata: PropTypes.object.isRequired,
  titleOnly: PropTypes.bool,
  truncate: PropTypes.bool,
};

DocumentTitle.defaultProps = {
  titleOnly: false,
  truncate: false,
};

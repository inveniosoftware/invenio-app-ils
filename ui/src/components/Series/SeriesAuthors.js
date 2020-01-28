import React from 'react';
import PropTypes from 'prop-types';
import { SeparatedList } from '@components/SeparatedList';
import isEmpty from 'lodash/isEmpty';

export const SeriesAuthors = ({ metadata, ...props }) => {
  return isEmpty(metadata.authors) ? null : (
    <div className="document-authors-list-wrapper">
      <SeparatedList
        items={metadata.authors}
        separator="; "
        className="document-authors-list"
        {...props}
      />
    </div>
  );
};

SeriesAuthors.propTypes = {
  metadata: PropTypes.object,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BackOfficeRoutes } from '@routes/urls';
import { PatronIcon } from '@pages/backoffice/components/icons';
import _get from 'lodash/get';

const ChangedBy = ({ metadata, field }) => {
  const byType = _get(metadata, `${field}.type`);
  const byValue = _get(metadata, `${field}.value`, '-');

  if (!byType) {
    return byValue;
  } else {
    switch (byType) {
      case 'user_id':
        return (
          <Link to={BackOfficeRoutes.patronDetailsFor(byValue)}>
            <PatronIcon /> {byValue}
          </Link>
        );
      default:
        return `${byType}:${byValue}`;
    }
  }
};

export const CreatedBy = ({ metadata }) => {
  return <ChangedBy metadata={metadata} field={'created_by'} />;
};

CreatedBy.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export const UpdatedBy = ({ metadata }) => {
  return <ChangedBy metadata={metadata} field={'updated_by'} />;
};

UpdatedBy.propTypes = {
  metadata: PropTypes.object.isRequired,
};

import React from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

export const DocumentLanguages = ({
  metadata,
  separator,
  withLabel,
  listItemAs,
}) => {
  const languages = _get(metadata, 'languages', []);
  if (!languages.length) {
    return null;
  }

  const labelCmp = withLabel ? <label>languages </label> : null;

  const languagesCmp = (
    <List horizontal className={'document-languages-list'}>
      {languages.map((language, index) => {
        const separatorCmp =
          index < metadata.languages.length - 1 ? separator : null;
        return (
          <List.Item as={listItemAs} key={`Key${index}`}>
            {language.toUpperCase()}
            {separatorCmp}
          </List.Item>
        );
      })}
    </List>
  );

  return (
    <>
      {labelCmp}
      {languagesCmp}
    </>
  );
};

DocumentLanguages.propTypes = {
  metadata: PropTypes.object.isRequired,
  listItemAs: PropTypes.string,
  separator: PropTypes.string,
  withLabel: PropTypes.bool,
};

DocumentLanguages.defaultProps = {
  listItemAs: '',
  separator: ', ',
  withLabel: false,
};

import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import { Table, Divider } from 'semantic-ui-react';
import { SeparatedList, InfoPopup } from '@components';

export const SeriesIdentifiers = ({ metadata }) => {
  return (
    <>
      <Divider horizontal>Identifiers</Divider>
      <Table definition>
        <Table.Body>
          <SeriesIdentifierRows metadata={metadata} />
        </Table.Body>
      </Table>
    </>
  );
};

SeriesIdentifiers.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export const SeriesIdentifierRows = ({ includeSchemes, metadata }) => {
  const identifiers = {};
  for (const id of get(metadata, 'identifiers', [])) {
    // Only include whitelisted schemes if includeSchemes is set
    if (!includeSchemes || includeSchemes.includes(id.scheme)) {
      const value = { value: id.value, material: id.material };
      if (id.scheme in identifiers) {
        identifiers[id.scheme].push(value);
      } else {
        identifiers[id.scheme] = [value];
      }
    }
  }

  return Object.entries(identifiers).map(([scheme, ids]) => {
    const values = ids.map(id => (
      <>
        {id.value}
        {id.material && (
          <>
            {' '}
            <InfoPopup message="Material for this identifier">
              ({capitalize(id.material)})
            </InfoPopup>
          </>
        )}
      </>
    ));
    return (
      <Table.Row key={scheme}>
        <Table.Cell>{scheme}</Table.Cell>
        <Table.Cell>
          <SeparatedList items={values} />
        </Table.Cell>
      </Table.Row>
    );
  });
};

SeriesIdentifierRows.propTypes = {
  includeSchemes: PropTypes.array,
  metadata: PropTypes.object.isRequired,
};

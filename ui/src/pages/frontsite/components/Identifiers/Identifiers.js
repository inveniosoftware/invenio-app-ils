import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { Table, Divider } from 'semantic-ui-react';
import { SeparatedList, InfoPopup, EmptyMessage } from '@components';
import isEmpty from 'lodash/isEmpty';

export const Identifiers = ({ identifiers }) => {
  return (
    <EmptyMessage
      show={!isEmpty(identifiers)}
      message="There are no identifiers."
    >
      <Divider horizontal>Identifiers</Divider>
      <Table definition>
        <Table.Body>
          <IdentifierRows identifiers={identifiers} />
        </Table.Body>
      </Table>
    </EmptyMessage>
  );
};

Identifiers.propTypes = {
  identifiers: PropTypes.array,
};

export const IdentifierRows = ({ includeSchemes, identifiers }) => {
  const idsByScheme = {};
  for (const id of identifiers) {
    // Only include whitelisted schemes if includeSchemes is set
    if (includeSchemes.length === 0 || includeSchemes.includes(id.scheme)) {
      const value = { value: id.value, material: id.material };
      if (id.scheme in idsByScheme) {
        idsByScheme[id.scheme].push(value);
      } else {
        idsByScheme[id.scheme] = [value];
      }
    }
  }

  return Object.entries(idsByScheme).map(([scheme, ids]) => {
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

IdentifierRows.propTypes = {
  includeSchemes: PropTypes.array,
  identifiers: PropTypes.array,
};

IdentifierRows.defaultProps = {
  includeSchemes: [],
};

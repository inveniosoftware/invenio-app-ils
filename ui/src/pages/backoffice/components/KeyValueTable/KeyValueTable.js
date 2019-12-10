import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Table } from 'semantic-ui-react';

export const KeyValueTable = ({ keyWidth, data, showEmpty }) => {
  return (
    <Table definition>
      <Table.Body>
        {data.map(row =>
          !showEmpty && isEmpty(row.value) ? null : (
            <Table.Row key={row.key}>
              <Table.Cell width={keyWidth}>{row.key}</Table.Cell>
              <Table.Cell>{row.value}</Table.Cell>
            </Table.Row>
          )
        )}
      </Table.Body>
    </Table>
  );
};

KeyValueTable.propTypes = {
  data: PropTypes.array.isRequired,
  keyWidth: PropTypes.number,
  showEmpty: PropTypes.bool,
};

KeyValueTable.defaultProps = {
  showEmpty: false,
  keyWidth: 5,
};

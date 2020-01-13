import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Table } from 'semantic-ui-react';
import { SeriesAlternativeTitles } from '.';

export const SeriesAllTitles = ({ metadata }) => {
  return (
    <>
      <Divider horizontal>Main titles</Divider>
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Title</Table.Cell>
            <Table.Cell>{metadata.title}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Abbreviated title</Table.Cell>
            <Table.Cell>{metadata.abbreviated_title}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <SeriesAlternativeTitles />
    </>
  );
};

SeriesAllTitles.propTypes = {
  metadata: PropTypes.object.isRequired,
};

import React from 'react';
import { Divider, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  SeriesAuthors,
  SeriesLanguages,
  SeriesModeOfIssuance,
} from '@components/Series';
import { IdentifierRows } from '../Identifiers';

export const SeriesInfo = ({ metadata }) => {
  return (
    <>
      <Divider horizontal>Details</Divider>
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Title</Table.Cell>
            <Table.Cell>{metadata.title}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Authors</Table.Cell>
            <Table.Cell>
              <SeriesAuthors metadata={metadata} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Mode of issuance</Table.Cell>
            <Table.Cell>
              <SeriesModeOfIssuance metadata={metadata} />
            </Table.Cell>
          </Table.Row>
          {metadata.publisher && (
            <Table.Row>
              <Table.Cell>Publisher</Table.Cell>
              <Table.Cell>{metadata.publisher}</Table.Cell>
            </Table.Row>
          )}
          {metadata.edition && (
            <Table.Row>
              <Table.Cell>Edition</Table.Cell>
              <Table.Cell>{metadata.edition}</Table.Cell>
            </Table.Row>
          )}
          {metadata.languages && (
            <Table.Row>
              <Table.Cell>Languages</Table.Cell>
              <Table.Cell>
                <SeriesLanguages metadata={metadata} />
              </Table.Cell>
            </Table.Row>
          )}
          {metadata.identifiers && (
            <IdentifierRows
              includeSchemes={['ISBN', 'ISSN']}
              identifiers={metadata.identifiers}
            />
          )}
        </Table.Body>
      </Table>
    </>
  );
};

SeriesInfo.propTypes = {
  metadata: PropTypes.object.isRequired,
};

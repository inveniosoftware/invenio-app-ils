import React, { Component } from 'react';
import { Divider, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentConference extends Component {
  render() {
    const { conference } = this.props;
    return conference ? (
      <>
        <Divider horizontal>Conference information</Divider>
        This {this.props.documentType.toLowerCase()} has a relation to a
        conference:
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Conference</Table.Cell>
              <Table.Cell>{conference.title}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Acronym</Table.Cell>
              <Table.Cell>{conference.acronym}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Dates</Table.Cell>
              <Table.Cell>{conference.dates}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Identifiers</Table.Cell>
              <Table.Cell>
                {conference.identifiers &&
                  conference.identifiers.map(
                    identifier =>
                      '(' + identifier.scheme + ') ' + identifier.value
                  )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Place</Table.Cell>
              <Table.Cell>{conference.place}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Series</Table.Cell>
              <Table.Cell>{conference.series}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    ) : null;
  }
}

DocumentConference.propTypes = {
  conference: PropTypes.object,
  documentType: PropTypes.string.isRequired,
};

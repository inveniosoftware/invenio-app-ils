import React, { Component } from 'react';
import { Divider, List, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentConference extends Component {
  constructor(props) {
    super(props);
    this.conference = props.conference;
  }

  render() {
    return (
      <>
        <Divider horizontal>Conference information</Divider>
        This {this.props.documentType.toLowerCase()} has a relation to a
        conference:
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Conference</Table.Cell>
              <Table.Cell>{this.conference.title}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Acronym</Table.Cell>
              <Table.Cell>{this.conference.acronym}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Dates</Table.Cell>
              <Table.Cell>{this.conference.dates}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Identifiers</Table.Cell>
              <Table.Cell>
                {this.conference.identifiers.map(
                  identifier =>
                    '(' + identifier.scheme + ') ' + identifier.value
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Place</Table.Cell>
              <Table.Cell>{this.conference.place}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Series</Table.Cell>
              <Table.Cell>{this.conference.series}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  }
}

DocumentConference.propTypes = {
  conference: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
};

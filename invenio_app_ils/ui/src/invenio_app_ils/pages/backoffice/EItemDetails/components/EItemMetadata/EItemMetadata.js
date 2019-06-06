import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Container, Header, Table } from 'semantic-ui-react';
import { openRecordEditor } from '../../../../../routes/urls';
import { eitem as eitemApi } from '../../../../../common/api';
import { EditButton } from '../../../components/buttons';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';

import './EItemMetadata.scss';

export default class EItemMetadata extends Component {
  renderUrlLinks = urls =>
    urls.map((url, index) => (
      <a href={url} key={url} target="_blank" rel="noopener noreferrer">
        Link {index + 1}
      </a>
    ));

  renderHeader = () => (
    <Grid.Row>
      <Grid.Column width={10} verticalAlign={'middle'}>
        <Header as="h1">EItem - {this.props.eitem.metadata.eitem_pid}</Header>
      </Grid.Column>
      <Grid.Column width={6} textAlign={'right'}>
        <EditButton
          clickHandler={() =>
            openRecordEditor(eitemApi.url, this.props.eitem.eitem_pid)
          }
        />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the EItem record
            with ID ${this.props.eitem.eitem_pid}?`}
          onDelete={() => this.props.deleteEItem(this.props.eitem.eitem_pid)}
        />
      </Grid.Column>
    </Grid.Row>
  );

  render() {
    const { eitem } = this.props;

    return (
      <Segment className="eitem-metadata">
        <Grid padded columns={2}>
          {this.renderHeader()}
          <Grid.Row>
            <Grid.Column>
              <Table basic="very" definition className="metadata-table">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Document</Table.Cell>
                    <Table.Cell>{eitem.metadata.document_pid}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Available urls</Table.Cell>
                    <Table.Cell>
                      {this.renderUrlLinks(eitem.metadata.urls)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Open access</Table.Cell>
                    <Table.Cell>
                      {eitem.metadata.open_access ? 'Yes' : 'No'}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Internal notes</Table.Cell>
                    <Table.Cell>{eitem.metadata.internal_notes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>

            <Grid.Column>
              <Container>
                <Header as="h4">Description</Header>
                <p>{eitem.metadata.description}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

EItemMetadata.propTypes = {
  eitem: PropTypes.object.isRequired,
};

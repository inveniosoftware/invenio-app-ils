import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Container, Header, Table } from 'semantic-ui-react';
import { EditButton } from '../../../../components/buttons';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

export default class EItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.eitemPid = this.props.eitemDetails.metadata.pid;
  }

  renderUrlLinks = urls =>
    urls.map((url, index) => (
      <a
        href={url.value}
        key={url.value}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link {index + 1}
      </a>
    ));

  renderHeader = () => (
    <Grid.Row>
      <Grid.Column width={10} verticalAlign={'middle'}>
        <Header as="h1">EItem - {this.eitemPid}</Header>
      </Grid.Column>
      <Grid.Column width={6} textAlign={'right'}>
        <EditButton to={BackOfficeRoutes.eitemEditFor(this.eitemPid)} />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the EItem record
            with ID ${this.eitemPid}?`}
          onDelete={() => this.props.deleteEItem(this.eitemPid)}
        />
      </Grid.Column>
    </Grid.Row>
  );

  render() {
    const { eitemDetails } = this.props;

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
                    <Table.Cell>
                      {eitemDetails.metadata.document_pid}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Available urls</Table.Cell>
                    <Table.Cell>
                      {this.renderUrlLinks(eitemDetails.metadata.urls || [])}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Open access</Table.Cell>
                    <Table.Cell>
                      {eitemDetails.metadata.open_access ? 'Yes' : 'No'}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Internal notes</Table.Cell>
                    <Table.Cell>
                      {eitemDetails.metadata.internal_notes}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>

            <Grid.Column>
              <Container>
                <Header as="h4">Description</Header>
                <p>{eitemDetails.metadata.description}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

EItemMetadata.propTypes = {
  eitemDetails: PropTypes.object.isRequired,
};

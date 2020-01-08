import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Divider, Grid, Header } from 'semantic-ui-react';
import { internalLocation as internalLocationApi } from '@api';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '@components';
import { DeleteRecordModal } from '../../../backoffice/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import { goTo } from '@history';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchAllLocations = props.fetchAllLocations;
    this.deleteLocation = props.deleteLocation;
  }

  componentDidMount() {
    this.fetchAllLocations();
  }

  createRefProps(locationPid) {
    return [
      {
        refType: 'Internal Location',
        onRefClick: iLocPid => {
          goTo(BackOfficeRoutes.ilocationsEditFor(iLocPid));
        },
        getRefData: () =>
          internalLocationApi.list(`location_pid:${locationPid}`),
      },
    ];
  }

  rowActions = ({ row }) => {
    return (
      <>
        <Button
          as={Link}
          to={BackOfficeRoutes.locationsEditFor(row.metadata.pid)}
          icon={'edit'}
          size="small"
          title={'Edit Record'}
        />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the Location
          record with ID ${row.metadata.pid}?`}
          onDelete={() => this.deleteLocation(row.metadata.pid)}
          refProps={this.createRefProps(row.metadata.pid)}
        />
      </>
    );
  };

  renderResults(data) {
    const headerActionComponent = (
      <NewButton text="New location" to={BackOfficeRoutes.locationsCreate} />
    );

    const columns = [
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Name', field: 'metadata.name' },
      { title: 'Address', field: 'metadata.address' },
      { title: 'Email', field: 'metadata.email' },
      { title: 'Actions', field: '', formatter: this.rowActions },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        title={'Locations'}
        name={'locations'}
        headerActionComponent={headerActionComponent}
      />
    );
  }

  render() {
    let { data, isLoading, error } = this.props;

    return (
      <Container fluid>
        <Header as="h2">Physical locations </Header>
        <Grid>
          <Grid.Column width={16}>
            <Container fluid className="spaced">
              <Loader isLoading={isLoading}>
                <Error error={error}>{this.renderResults(data)}</Error>
              </Loader>
            </Container>
            <br />
            <Divider />
            <br />
            <Container fluid className="spaced">
              <InternalLocationList />
            </Container>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

LocationList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchAllLocations: PropTypes.func.isRequired,
  deleteLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
};

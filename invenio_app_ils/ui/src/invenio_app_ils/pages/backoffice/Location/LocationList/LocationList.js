import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import omit from 'lodash/omit';
import { internalLocation as internalLocationApi } from '../../../../common/api';
import { InternalLocationList } from './components';
import {
  Error,
  Loader,
  ResultsTable,
  formatter,
} from '../../../../common/components';
import { DeleteRecordModal } from '../../../backoffice/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { goToHandler, goTo } from '../../../../history';

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

  rowActions(locationPid) {
    return (
      <>
        <Button
          icon={'edit'}
          onClick={goToHandler(BackOfficeRoutes.locationsEditFor(locationPid))}
          size="small"
          title={'Edit Record'}
        />
        <DeleteRecordModal
          deleteHeader={`Are you sure you want to delete the Location
          record with ID ${locationPid}?`}
          onDelete={() => this.deleteLocation(locationPid)}
          refProps={this.createRefProps(locationPid)}
        />
      </>
    );
  }

  prepareData(data) {
    const rows = data.hits.map(row => {
      let serialized = formatter.location.toTable(row);
      serialized['Actions'] = this.rowActions(row.pid);
      return omit(serialized, ['Created', 'Updated', 'Link']);
    });
    rows.totalHits = data.total;
    return rows;
  }

  renderResults(data) {
    const rows = this.prepareData(data);
    const headerActionComponent = (
      <NewButton url={BackOfficeRoutes.locationsCreate} />
    );
    return (
      <ResultsTable
        rows={rows}
        title={'Locations'}
        name={'locations'}
        headerActionComponent={headerActionComponent}
      />
    );
  }

  render() {
    let { data, isLoading, error } = this.props;

    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>{this.renderResults(data)}</Error>
        </Loader>
        <InternalLocationList />
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
  showMaxItems: PropTypes.number,
};

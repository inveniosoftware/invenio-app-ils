import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import {
  location as locationApi,
  internalLocation as internalLocationApi,
} from '../../../common/api';
import { openRecordEditor } from '../../../common/urls';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '../../../common/components';
import { DeleteRecordModal } from '../../backoffice/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../components/buttons';
import { formatter } from '../../../common/components/ResultsTable/formatters';
import omit from 'lodash/omit';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = props.fetchLocations;
    this.deleteLocation = props.deleteLocation;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  _handleOnRefClick(iLocPid) {
    openRecordEditor(internalLocationApi.url, iLocPid);
  }

  _rowActions(locationPid) {
    return (
      <>
        <Button
          icon={'edit'}
          onClick={() => openRecordEditor(locationApi.url, locationPid)}
          size="small"
          title={'Edit Record'}
        />
        <DeleteRecordModal
          headerContent={`Are you sure you want to delete the Location
              record with ID ${locationPid}?`}
          onDelete={() => this.deleteLocation(locationPid)}
          refType={'Internal Location'}
          onRefClick={this._handleOnRefClick}
          checkRefs={() =>
            internalLocationApi.list(`location_pid:${locationPid}`)
          }
        />
      </>
    );
  }

  prepareData(data) {
    const rows = data.hits.map(row => {
      let serialized = formatter.location.toTable(row);
      serialized['Actions'] = this._rowActions(row.location_pid);
      return omit(serialized, ['Created', 'Updated', 'Link']);
    });
    rows.totalHits = data.total;
    return rows;
  }

  _renderResults(data) {
    const rows = this.prepareData(data);
    const headerActionComponent = (
      <NewButton
        clickHandler={() => {
          openRecordEditor(locationApi.url);
        }}
      />
    );
    return (
      <ResultsTable
        rows={rows}
        title={'Locations'}
        name={'locations'}
        headerActionComponent={headerActionComponent}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    let { data, isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>{this._renderResults(data)}</Error>
        </Loader>
        <InternalLocationList />
      </Container>
    );
  }
}

LocationList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  deleteLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

LocationList.defaultProps = {
  showMaxItems: 5,
};

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
import remove from 'lodash/remove';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = props.fetchLocations;
    this.deleteLocation = props.deleteLocation;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.location.toTable(row);
      serialized['Actions'] = (
        <>
          <Button
            icon={'edit'}
            onClick={() => openRecordEditor(locationApi.url, row.location_pid)}
            size="small"
            title={'Edit Record'}
          />
          <DeleteRecordModal
            headerContent={`Are you sure you want to delete the record Location
              record with ID ${row.location_pid}?`}
            deleteFunction={() => this._requestDelete(row.location_pid)}
            refApiUrl={internalLocationApi.url}
            checkRefs={() =>
              internalLocationApi.list(`location_pid:${row.location_pid}`)
            }
          />
        </>
      );
      return omit(serialized, ['Created', 'Updated', 'Link']);
    });
  }

  async _requestDelete(locationId) {
    await this.deleteLocation(locationId);
    let { hasError } = this.props;
    if (!hasError) {
      remove(this.props.data.hits, entry => entry.location_pid === locationId);
      // NOTE: setState in order to trigger a render
      this.setState({ state: this.state });
    }
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
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Container>
            {this._renderResults(data)}
            <InternalLocationList />
          </Container>
        </Error>
      </Loader>
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

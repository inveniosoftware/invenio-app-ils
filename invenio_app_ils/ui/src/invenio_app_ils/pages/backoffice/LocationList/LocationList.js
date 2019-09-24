import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { internalLocation as internalLocationApi } from '../../../common/api';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '../../../common/components';
import { DeleteRecordModal } from '../../backoffice/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../components/buttons';
import isEmpty from 'lodash/isEmpty';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = props.fetchLocations;
    this.deleteLocation = props.deleteLocation;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  createRefProps(locationPid) {
    return [
      {
        refType: 'Internal Location',
        onRefClick: iLocPid => {
          // TODO: EDITOR, implement edit form
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
          onClick={() => {
            // TODO: EDITOR, implement edit form
          }}
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

  renderResults() {
    const { data } = this.props;
    if (isEmpty(data.hits)) return null;
    const curratedData = data.hits.map(row => {
      row['actions'] = this.rowActions(row.pid);
      return row;
    });
    curratedData.totalHits = data.total;
    const headerActionComponent = (
      <NewButton
        clickHandler={() => {
          // TODO: EDITOR, implement create form
        }}
      />
    );
    return (
      <ResultsTable
        data={curratedData}
        title={'Locations'}
        name={'locations'}
        entity={'location'}
        hideProps={['Created', 'Updated', 'Link']}
        headerActionComponent={headerActionComponent}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>{this.renderResults()}</Error>
        </Loader>
        <InternalLocationList data={data} />
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

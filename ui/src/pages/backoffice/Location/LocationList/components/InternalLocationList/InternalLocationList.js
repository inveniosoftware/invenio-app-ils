import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { item as itemApi } from '@api';
import { Error, Loader, ResultsTable } from '@components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '@pages/backoffice/components/buttons';
import { DeleteRecordModal } from '../../../../../backoffice/components';
import { BackOfficeRoutes } from '@routes/urls';

export default class InternalLocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchInternalLocations = props.fetchInternalLocations;
    this.deleteInternalLocation = props.deleteInternalLocation;
  }

  componentDidMount() {
    this.fetchInternalLocations();
  }

  handleOnRefClick(itemPid) {
    const navUrl = BackOfficeRoutes.itemEditFor(itemPid);
    window.open(navUrl, `_edit_item_${itemPid}`);
  }

  createRefProps(ilocPid) {
    return [
      {
        refType: 'Item',
        onRefClick: this.handleOnRefClick,
        getRefData: () => itemApi.list(`internal_location_pid:${ilocPid}`),
      },
    ];
  }

  rowActions = ({ row }) => {
    return (
      <>
        <Button
          as={Link}
          to={BackOfficeRoutes.ilocationsEditFor(row.metadata.pid)}
          icon={'edit'}
          size="small"
          title={'Edit Record'}
        />
        <DeleteRecordModal
          refProps={this.createRefProps(row.metadata.pid)}
          onDelete={() => this.deleteInternalLocation(row.metadata.pid)}
          deleteHeader={`Are you sure you want to delete the Internal Location
          record with ID ${row.metadata.pid}?`}
        />
      </>
    );
  };

  renderResults(data) {
    const headerActionComponent = (
      <NewButton
        text="New internal location"
        to={BackOfficeRoutes.ilocationsCreate}
      />
    );

    const columns = [
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Location', field: 'metadata.location.name' },
      { title: 'Name', field: 'metadata.name' },
      { title: 'Physical location', field: 'metadata.physical_location' },
      { title: 'Location e-mail', field: 'metadata.location.email' },
      { title: 'Actions', field: '', formatter: this.rowActions },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        showAllResults={true}
        title={'Internal Locations'}
        name={'internal locations'}
        headerActionComponent={headerActionComponent}
      />
    );
  }

  render() {
    let { data, error, isLoading } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderResults(data)}</Error>
      </Loader>
    );
  }
}

InternalLocationList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchInternalLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
};

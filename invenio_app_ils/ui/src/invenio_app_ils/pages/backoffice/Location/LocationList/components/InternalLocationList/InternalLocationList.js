import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { item as itemApi } from '../../../../../../common/api';
import {
  Error,
  Loader,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../../../components/buttons';
import { DeleteRecordModal } from '../../../../../backoffice/components';
import omit from 'lodash/omit';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

export default class InternalLocationList extends Component {
  componentDidMount() {
    this.props.fetchInternalLocations();
  }

  handleOnRefClick(ilocPid) {
    // TODO: navigate to item edit form
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

  rowActions(ilocPid) {
    return (
      <>
        <Button
          icon={'edit'}
          size="small"
          title={'Edit Record'}
          as={Link}
          to={BackOfficeRoutes.ilocationsEditFor(ilocPid)}
        />
        <DeleteRecordModal
          refProps={this.createRefProps(ilocPid)}
          onDelete={() => this.props.deleteInternalLocation(ilocPid)}
          deleteHeader={`Are you sure you want to delete the Internal Location
          record with ID ${ilocPid}?`}
        />
      </>
    );
  }

  prepareData(data) {
    const rows = data.hits.map(row => {
      let serialized = formatter.internalLocation.toTable(row);
      serialized['Actions'] = this.rowActions(row.pid);
      return omit(serialized, [
        'Created',
        'Updated',
        'Link',
        'Location ID',
        'Location e-mail',
      ]);
    });
    rows.totalHits = data.total;
    return rows;
  }

  renderResults(data) {
    const rows = this.prepareData(data);
    const headerActionComponent = (
      <NewButton url={BackOfficeRoutes.ilocationsCreate} />
    );
    return (
      <ResultsTable
        rows={rows}
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

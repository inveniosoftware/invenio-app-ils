import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  internalLocation as internalLocationApi,
  item as itemApi,
} from '../../../../../common/api';
import { openRecordEditor } from '../../../../../routes/urls';
import { Error, Loader, ResultsTable } from '../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { DeleteRecordModal } from '../../../../backoffice/components';
import omit from 'lodash/omit';

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
    openRecordEditor(itemApi.url, itemPid);
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
          onClick={() => openRecordEditor(internalLocationApi.url, ilocPid)}
        />
        <DeleteRecordModal
          refProps={this.createRefProps(ilocPid)}
          onDelete={() => this.deleteInternalLocation(ilocPid)}
          deleteHeader={`Are you sure you want to delete the Internal Location
          record with ID ${ilocPid}?`}
        />
      </>
    );
  }

  prepareData(data) {
    const rows = data.hits.map(row => {
      let serialized = formatter.internalLocation.toTable(row);
      serialized['Actions'] = this.rowActions(row.internal_location_pid);
      return omit(serialized, ['Created', 'Updated', 'Link']);
    });
    rows.totalHits = data.total;
    return rows;
  }

  renderResults(data) {
    const rows = this.prepareData(data);
    const headerActionComponent = (
      <NewButton
        clickHandler={() => {
          openRecordEditor(internalLocationApi.url);
        }}
      />
    );
    return (
      <ResultsTable
        rows={rows}
        title={'Internal Locations'}
        name={'internal locations'}
        headerActionComponent={headerActionComponent}
        showMaxRows={this.props.showMaxItems}
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
  showMaxItems: PropTypes.number,
};

InternalLocationList.defaultProps = {
  showMaxItems: 10,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { item as itemApi } from '../../../../../common/api';
import { Error, Loader, ResultsTable } from '../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../../components/buttons';
import { DeleteRecordModal } from '../../../../backoffice/components';
import isEmpty from 'lodash/isEmpty';

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
    // TODO: EDITOR, implement edit form
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
          onClick={() => {
            // TODO: EDITOR, implement edit form
          }}
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
        title={'Internal Locations'}
        name={'internal locations'}
        entity={'internalLocation'}
        hideProps={['Created', 'Updated', 'Link']}
        headerActionComponent={headerActionComponent}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    let { data, error, isLoading } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderResults()}</Error>
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

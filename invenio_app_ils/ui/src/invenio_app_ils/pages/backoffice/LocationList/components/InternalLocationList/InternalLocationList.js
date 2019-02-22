import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { internalLocation as internalLocationApi } from '../../../../../common/api';
import { openRecordEditor } from '../../../../../common/urls';
import { Error, Loader, ResultsTable } from '../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../../components/buttons';

export default class InternalLocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchInternalLocations = this.props.fetchInternalLocations;
  }

  componentDidMount() {
    this.fetchInternalLocations();
  }

  prepareData(data) {
    return data.map(row => ({
      ID: row.internal_location_pid,
      Name: row.name,
      'Physical Location': row.physical_location,
      'Location Email': row.location_email,
      'Location Name': row.location_name,
      'Location ID': row.location_pid,
    }));
  }

  _renderResults(data) {
    const rows = this.prepareData(data);
    const rowActionComponent = <Button circular compact icon="edit" />;
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
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={ilocid =>
          openRecordEditor(internalLocationApi.url, ilocid)
        }
        rowActionComponent={rowActionComponent}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    let { data, hasError, isLoading } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>{this._renderResults(data)}</Error>
      </Loader>
    );
  }
}

InternalLocationList.propTypes = {
  data: PropTypes.array.isRequired,
  fetchInternalLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

InternalLocationList.defaultProps = {
  showMaxItems: 10,
};

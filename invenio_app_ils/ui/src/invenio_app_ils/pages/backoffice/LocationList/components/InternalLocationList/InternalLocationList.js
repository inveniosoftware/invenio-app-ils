import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { Error, Loader, ResultsTable } from '../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { invenioConfig } from '../../../../../common/config';

export default class InternalLocationlist extends Component {
  constructor(props) {
    super(props);
    this.fetchInternalLocations = this.props.fetchInternalLocations;
  }

  componentDidMount() {
    this.fetchInternalLocations();
  }

  openEditor(url) {
    window.open(`${invenioConfig.editor.url}?url=${url}`, url);
  }

  prepareData() {
    return this.props.data.map(row => ({
      ID: row.internal_location_pid,
      Name: row.name,
      'Physical Location': row.physical_location,
      'Location Email': row.location_email,
      'Location Name': row.location_name,
      'Location ID': row.location_pid,
    }));
  }

  render() {
    let { data, hasError, isLoading } = this.props;
    const rows = this.prepareData();
    const errorData = hasError ? data : null;
    const internalLocationsUrl = !_isEmpty(data) ? data.link : null;
    const actionComponent = <Button circular compact icon="edit" />;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <ResultsTable
            rows={rows}
            name={'Internal Locations'}
            actionClickHandler={() => this.openEditor(internalLocationsUrl)}
            showMaxRows={this.props.showMaxItems}
            actionComponent={actionComponent}
          />
        </Error>
      </Loader>
    );
  }
}

InternalLocationlist.propTypes = {
  data: PropTypes.array.isRequired,
  fetchInternalLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

InternalLocationlist.defaultProps = {
  showMaxItems: 10,
};

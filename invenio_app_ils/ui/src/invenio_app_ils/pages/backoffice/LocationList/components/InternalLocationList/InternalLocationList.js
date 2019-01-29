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

  prepareData(data) {
    return data.map(row => ({
      ID: row.metadata.internal_location_pid,
      Name: row.metadata.name,
      'Physical Location': row.metadata.physical_location,
      'Location Email': row.metadata.location.email,
      'Location Name': row.metadata.location.name,
      'Location ID': row.metadata.location_pid,
    }));
  }

  render() {
    let { data, hasError, isLoading } = this.props;
    const rows = this.prepareData(data.hits || []);
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
  data: PropTypes.object.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

InternalLocationlist.defaultProps = {
  showMaxItems: 10,
};

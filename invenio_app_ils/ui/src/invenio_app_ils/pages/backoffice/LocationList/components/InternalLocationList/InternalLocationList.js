import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { internalLocationItemUrl } from '../../../../../common/api/urls';
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
    const actionComponent = <Button circular compact icon="edit" />;
    return (
      <ResultsTable
        rows={rows}
        name={'Internal Locations'}
        actionClickHandler={id => this.openEditor(internalLocationItemUrl(id))}
        showMaxRows={this.props.showMaxItems}
        actionComponent={actionComponent}
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

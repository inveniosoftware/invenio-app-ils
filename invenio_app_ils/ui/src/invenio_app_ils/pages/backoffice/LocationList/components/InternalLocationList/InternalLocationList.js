import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { internalLocation as internalLocationApi } from '../../../../../common/api';
import { openRecordEditor } from '../../../../../common/urls';
import { Error, Loader, ResultsTable } from '../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { omit } from 'lodash/object';

export default class InternalLocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchInternalLocations = this.props.fetchInternalLocations;
  }

  componentDidMount() {
    this.fetchInternalLocations();
  }

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.internalLocation.toTable(row);
      serialized['Actions'] = (
        <Button
          size="small"
          content={'Edit'}
          onClick={() =>
            openRecordEditor(internalLocationApi.url, row.internal_location_pid)
          }
        />
      );
      return omit(serialized, ['Created', 'Updated', 'Link']);
    });
  }

  _renderResults(data) {
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
        <Error error={error}>{this._renderResults(data)}</Error>
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

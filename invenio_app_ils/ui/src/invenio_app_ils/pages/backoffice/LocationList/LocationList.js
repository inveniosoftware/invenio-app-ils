import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { location as locationApi } from '../../../common/api';
import { openRecordEditor } from '../../../common/urls';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '../../../common/components';
import { Button } from 'semantic-ui-react';
import { NewButton } from '../components/buttons';
import { formatter } from '../../../common/components/ResultsTable/formatters';
import { omit } from 'lodash/object';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = this.props.fetchLocations;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.location.toTable(row);
      serialized['Actions'] = (
        <Button
          size="small"
          content={'Edit'}
          onClick={() => openRecordEditor(locationApi.url, row.location_pid)}
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
          openRecordEditor(locationApi.url);
        }}
      />
    );
    return (
      <ResultsTable
        rows={rows}
        title={'Locations'}
        name={'locations'}
        headerActionComponent={headerActionComponent}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    let { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Container>
            {this._renderResults(data)}
            <InternalLocationList />
          </Container>
        </Error>
      </Loader>
    );
  }
}

LocationList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

LocationList.defaultProps = {
  showMaxItems: 5,
};

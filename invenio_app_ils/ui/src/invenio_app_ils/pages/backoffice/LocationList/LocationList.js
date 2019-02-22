import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';
import { location as locationApi } from '../../../common/api';
import { openRecordEditor } from '../../../common/urls';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '../../../common/components';
import { NewButton } from '../components/buttons';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = this.props.fetchLocations;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  prepareData(data) {
    return data.map(row => ({
      ID: row.location_pid,
      Address: row.address,
      Email: row.email,
      Name: row.name,
    }));
  }

  _renderResults(data) {
    const rows = this.prepareData(data);
    const rowActionComponent = <Button circular compact icon="edit" />;
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
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={locid =>
          openRecordEditor(locationApi.url, locid)
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
        <Error error={errorData}>
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
  data: PropTypes.array.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  showMaxItems: PropTypes.number,
};

LocationList.defaultProps = {
  showMaxItems: 5,
};

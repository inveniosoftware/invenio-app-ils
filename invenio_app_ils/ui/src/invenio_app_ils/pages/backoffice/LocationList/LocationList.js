import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';
import { locationItemUrl } from '../../../common/api/urls';
import { InternalLocationList } from './components';
import { Error, Loader, ResultsTable } from '../../../common/components';
import { invenioConfig } from '../../../common/config';

export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.fetchLocations = this.props.fetchLocations;
  }

  componentDidMount() {
    this.fetchLocations();
  }

  openEditor(url) {
    window.open(`${invenioConfig.editor.url}?url=${url}`, url);
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
    const actionComponent = <Button circular compact icon="edit" />;
    return (
      <ResultsTable
        rows={rows}
        name={'Locations'}
        actionClickHandler={id => this.openEditor(locationItemUrl(id))}
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

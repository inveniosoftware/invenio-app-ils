import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

export class BookSeries extends Component {
  constructor(props) {
    super(props);
    this.series = props.series;
    this.goToSeriesList = props.goToSeriesList;
  }

  render() {
    return (
      <div>
        {this.renderSeries(
          get(this.series, 'serial'),
          'Part of the following series:'
        )}
        <div className="ui hidden divider" />
        {this.renderSeries(
          get(this.series, 'multipart'),
          'Part of the following multipart monograph:'
        )}
      </div>
    );
  }

  renderSeries = (series, description) => {
    return !isEmpty(series) ? (
      <div>
        <Header as="h4">{description}</Header>
        <List>
          {series.map((serie, index) => (
            <List.Item
              as="a"
              key={`Key${index}`}
              onClick={this.goToSeriesList(serie.series_pid)}
            >
              {serie.title}
            </List.Item>
          ))}
        </List>
      </div>
    ) : null;
  };
}

BookSeries.propTypes = {
  series: PropTypes.object.isRequired,
  goToSeriesList: PropTypes.func.isRequired,
};

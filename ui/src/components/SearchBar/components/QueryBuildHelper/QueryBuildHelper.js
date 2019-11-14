import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Grid } from 'semantic-ui-react';

export default class QueryBuildHelper extends Component {
  constructor(props) {
    super(props);
    this.updateQueryString = this.props.updateQueryString;
  }

  addToQuery = field => {
    const defaultVal = field.defaultValue ? field.defaultValue : '*';
    const newCriteriaString = `${field.field}:${defaultVal}`;
    const previousQueryString = this.props.currentQueryString;

    if (previousQueryString === '') {
      this.props.updateQueryString(newCriteriaString);
    } else {
      this.props.updateQueryString(
        `${previousQueryString} AND ${newCriteriaString}`
      );
    }
  };

  renderListItems = fields => {
    let components = [];

    for (let i = 0; i < fields.length; i++) {
      components.push(
        <List.Item
          key={fields[i].field}
          as="a"
          onClick={() => {
            this.addToQuery(fields[i]);
          }}
        >
          {fields[i].name}
        </List.Item>
      );
    }

    return components;
  };

  renderHelperFields = fields => {
    return (
      <List bulleted horizontal>
        {this.renderListItems(fields)}
      </List>
    );
  };

  render() {
    const { fields } = this.props;
    return (
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            Search by: {this.renderHelperFields(fields)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

QueryBuildHelper.propTypes = {
  fields: PropTypes.array.isRequired,
  currentQueryString: PropTypes.string.isRequired,
  updateQueryString: PropTypes.func.isRequired,
};

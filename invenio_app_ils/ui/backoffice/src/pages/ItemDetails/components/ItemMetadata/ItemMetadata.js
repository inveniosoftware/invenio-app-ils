import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form } from 'semantic-ui-react';

import './ItemMetadata.scss';

export class ItemMetadata extends Component {
  renderItemMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      if (typeof data.metadata[key] !== 'object') {
        return (
          <Form.Field key={key}>
            <label className="field-name">{key}</label>
            <p>{data.metadata[key]}</p>
          </Form.Field>
        );
      }
      return '';
    });
  }

  render() {
    let { data } = this.props;
    return (
      <Segment raised className="item-metadata">
        <Grid>
          <Grid.Column>
            <Form>{this.renderItemMetadata(data)}</Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};

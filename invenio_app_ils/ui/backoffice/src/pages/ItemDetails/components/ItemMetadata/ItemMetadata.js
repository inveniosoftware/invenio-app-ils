import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form, Image } from 'semantic-ui-react';

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
      <Segment raised>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5} floated="left">
              <Image
                className="book-cover"
                src="https://via.placeholder.com/256x384"
                rounded
              />
            </Grid.Column>
            <Grid.Column width={10} floated="right">
              <Form>{this.renderItemMetadata(data)}</Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};

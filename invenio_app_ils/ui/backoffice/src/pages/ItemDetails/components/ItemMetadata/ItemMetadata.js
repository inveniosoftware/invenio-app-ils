import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form, Image } from 'semantic-ui-react';

class ItemMetadata extends Component {
  renderItemMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      return (
        <Form.Field key={key}>
          <label>{key}</label>
          <input defaultValue={data.metadata[key]} />
        </Form.Field>
      );
    });
  }

  render() {
    let { data } = this.props;
    console.log(data);
    return (
      <Segment raised>
        <Grid columns={2} divided>
          <Grid.Column floated="left">
            <Form>{this.renderItemMetadata(data)}</Form>
          </Grid.Column>
          <Grid.Column>
            <Grid.Row textAlign="right">
              <Image
                src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                size="medium"
                rounded
                bordered
              />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default ItemMetadata;

ItemMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};

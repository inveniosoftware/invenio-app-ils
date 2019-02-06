import React, { Component } from 'react';
import { Button, Grid, Header, Segment, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class RecordsBriefCard extends Component {
  render() {
    const { title, stats, text, buttonLeft, buttonRight } = this.props;

    return (
      <Segment raised>
        <Header textAlign="right" as="h3">
          {title}
        </Header>
        <p>
          {' '}
          {stats} {text}
        </p>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>{buttonLeft}</Grid.Column>
            <Grid.Column width={8}>{buttonRight}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

RecordsBriefCard.propTypes = {
  title: PropTypes.string.isRequired,
  stats: PropTypes.number.isRequired,
  text: PropTypes.string,
  buttonLeft: PropTypes.node,
  buttonRight: PropTypes.node,
};

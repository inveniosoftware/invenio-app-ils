import React, { Component } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class RecordsBriefCard extends Component {
  render() {
    const { title, stats, text, buttonLeft, buttonRight } = this.props;

    return (
      <Segment raised className={'brief-card'}>
        <Header textAlign="right" as="h3">
          {title}
        </Header>
        <p>
          {' '}
          <span data-test={stats}>{stats}</span> {text}
        </p>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>{buttonLeft ? buttonLeft : ''}</Grid.Column>
            <Grid.Column width={8}>
              {buttonRight ? buttonRight : ''}
            </Grid.Column>
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

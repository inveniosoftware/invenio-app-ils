import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

export default class DeleteButton extends Component {
  render() {
    return (
      <Button
        color={'red'}
        icon={'trash alternate'}
        size={'small'}
        title={'Delete record'}
        {...this.props}
      />
    );
  }
}

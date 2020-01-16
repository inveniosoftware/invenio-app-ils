import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RejectAction } from './RejectAction';
import { Container } from 'semantic-ui-react';

export default class DocumentRequestActions extends Component {
  onReject = data => {
    this.props.rejectRequest(this.props.data.pid, data);
  };

  render() {
    const { metadata } = this.props.data;
    return (
      <Container fluid textAlign={'right'}>
        <RejectAction
          pid={metadata.pid}
          onReject={this.onReject}
          disabled={metadata.state !== 'PENDING'}
        />
      </Container>
    );
  }
}

DocumentRequestActions.propTypes = {
  data: PropTypes.object.isRequired,
  rejectRequest: PropTypes.func.isRequired,
};

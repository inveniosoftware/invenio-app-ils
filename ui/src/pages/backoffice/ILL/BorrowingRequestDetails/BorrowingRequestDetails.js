import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { BorrowingRequestMetadata } from './components';

export default class BorrowingRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchBorrowingRequestDetails = this.props.fetchBorrowingRequestDetails;
  }

  componentDidMount() {
    this.props.fetchBorrowingRequestDetails(
      this.props.match.params.borrowingRequestPid
    );
  }

  componentDidUpdate(prevProps) {
    const borrowingRequestPid = this.props.match.params.borrowingRequestPid;
    const samePidFromRouter =
      prevProps.match.params.borrowingRequestPid === borrowingRequestPid;
    if (!samePidFromRouter) {
      this.props.fetchBorrowingRequestDetails(borrowingRequestPid);
    }
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Container>
              <BorrowingRequestMetadata />
            </Container>
          </Error>
        </Loader>
      </Container>
    );
  }
}

BorrowingRequestDetails.propTypes = {
  fetchBorrowingRequestDetails: PropTypes.func.isRequired,
};

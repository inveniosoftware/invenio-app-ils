import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentPendingLoans } from './DocumentPendingLoans';

export class DocumentPendingLoansContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
  }

  componentDidMount() {
    this.fetchPendingLoans(this.props.match.params.documentPid);
  }

  render() {
    const { isLoading, data, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentPendingLoans
            data={data}
            documentPid={this.props.match.params.documentPid}
          />
        </Error>
      </Loader>
    );
  }
}

DocumentPendingLoansContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
};

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentDetails } from './DocumentDetails';

export class DocumentDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentDetails = props.fetchDocumentDetails;
  }

  componentDidMount() {
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  render() {
    const { isLoading, data, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentDetails data={data} />
        </Error>
      </Loader>
    );
  }
}

DocumentDetailsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  fetchDocumentDetails: PropTypes.func.isRequired,
};

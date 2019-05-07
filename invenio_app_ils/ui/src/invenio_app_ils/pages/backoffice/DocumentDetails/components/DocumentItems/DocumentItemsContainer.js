import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentItems } from './DocumentItems';

export class DocumentItemsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentItems = props.fetchDocumentItems;
  }

  componentDidMount() {
    this.fetchDocumentItems(this.props.match.params.documentPid);
  }

  render() {
    const { isLoading, data, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentItems
            data={data}
            documentPid={this.props.match.params.documentPid}
          />
        </Error>
      </Loader>
    );
  }
}

DocumentItemsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  fetchDocumentItems: PropTypes.func.isRequired,
};

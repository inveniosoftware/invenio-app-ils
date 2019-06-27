import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DocumentItem from '../DocumentItem/DocumentItem';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  render() {
    const rows = this.props.results;
    return rows.length ? (
      <div>
        {rows.map(row => (
          <DocumentItem
            key={row.metadata.document_pid}
            data-test={row.metadata.document_pid}
            metadata={row.metadata}
            rowActionClickHandler={this.viewDetailsClickHandler}
          />
        ))}
      </div>
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

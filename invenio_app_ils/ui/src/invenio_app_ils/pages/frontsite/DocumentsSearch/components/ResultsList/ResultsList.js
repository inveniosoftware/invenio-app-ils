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
          <div key={row.metadata.document_pid}>
            <DocumentItem
              metadata={row.metadata}
              rowActionClickHandler={this.viewDetailsClickHandler}
            />
          </div>
        ))}
      </div>
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromISO, toShortDate } from '../../../../../common/api/date';
import DocumentItem from '../DocumentItem/DocumentItem';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  getFormattedDate = d => (d ? toShortDate(fromISO(d)) : '');

  prepareData(rows) {
    return rows.map(row => ({
      ID: row.metadata.document_pid,
      Title: row.metadata.title,
      Authors: row.metadata.authors[0],
      Publishers: row.metadata.publishers[0],
      Abstracts: row.metadata.abstracts[0],
      Created: this.getFormattedDate(row.created),
      Updated: this.getFormattedDate(row.updated),
    }));
  }

  render() {
    const rows = this.prepareData(this.props.results);
    return rows.length ? (
      <div>
        {rows.map(row => (
          <div key={row.ID}>
            <DocumentItem
              metadata={row}
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

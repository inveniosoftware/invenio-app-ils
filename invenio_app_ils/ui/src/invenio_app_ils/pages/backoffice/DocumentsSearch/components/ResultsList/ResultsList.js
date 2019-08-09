import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { document as documentApi } from '../../../../../common/api';
import { openRecordEditor } from '../../../../../routes/urls';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';

export class ResultsList extends Component {
  prepareData(data) {
    return data.map(row => {
      return pick(formatter.document.toTable(row), [
        'ID',
        'Created',
        'Updated',
        'Title',
        'Authors',
        'Series',
        'Available Items',
        '# Loans',
      ]);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const headerActionComponent = (
      <NewButton
        text={'New document'}
        clickHandler={() => {
          openRecordEditor(documentApi.url);
        }}
      />
    );

    return rows.length ? (
      <ResultsTable
        rows={rows}
        title={''}
        name={'documents'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.props.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

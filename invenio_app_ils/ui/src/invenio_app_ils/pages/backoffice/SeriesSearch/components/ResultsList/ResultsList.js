import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { series as seriesApi } from '../../../../../common/api';
import { openRecordEditor } from '../../../../../routes/urls';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData(data) {
    return data.map(row => {
      return pick(formatter.series.toTable(row), [
        'ID',
        'Created',
        'Updated',
        'Mode of Issuance',
        'Title',
        'Authors',
      ]);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const headerActionComponent = (
      <NewButton
        text={'New series'}
        clickHandler={() => {
          openRecordEditor(seriesApi.url);
        }}
      />
    );

    return rows.length ? (
      <ResultsTable
        rows={rows}
        title={''}
        name={'series'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

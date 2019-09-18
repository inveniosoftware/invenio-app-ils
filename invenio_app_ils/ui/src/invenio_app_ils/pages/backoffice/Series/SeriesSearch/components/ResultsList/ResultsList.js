import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../common/components';
import { NewButton } from '../../../../components/buttons';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { ExportReactSearchKitResults } from '../../../../components';
import { series as seriesApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { goTo } from '../../../../../../history';

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
      <div>
        <NewButton
          text={'New series'}
          clickHandler={() => {
            goTo(BackOfficeRoutes.seriesCreate);
          }}
        />
        <ExportReactSearchKitResults exportBaseUrl={seriesApi.url} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'series'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

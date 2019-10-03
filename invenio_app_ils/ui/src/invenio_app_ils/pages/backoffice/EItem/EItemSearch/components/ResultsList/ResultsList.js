import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../common/components';
import { NewButton } from '../../../../components/buttons';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import omit from 'lodash/omit';
import { ExportReactSearchKitResults } from '../../../../components';
import { eitem as eitemApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { goToHandler } from '../../../../../../history';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData() {
    return this.props.results.map(row => {
      return omit(formatter.eitem.toTable(row), ['Created', 'Updated']);
    });
  }

  render() {
    const rows = this.prepareData();
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;
    const headerActionComponent = (
      <div>
        <NewButton
          text={'New eitem'}
          clickHandler={goToHandler(BackOfficeRoutes.eitemCreate)}
        />
        <ExportReactSearchKitResults exportBaseUrl={eitemApi.searchBaseURL} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'eitems'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
        showMaxRows={maxRowsToShow}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

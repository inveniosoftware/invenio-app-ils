import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import omit from 'lodash/omit';
import { ExportReactSearchKitResults } from '../../../components';
import { item as itemApi } from '../../../../../common/api';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData() {
    return this.props.results.map(row => {
      return omit(formatter.item.toTable(row), ['Created', 'Updated']);
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
          text={'New item'}
          clickHandler={() => {
            // TODO: EDITOR, implement create form
          }}
        />
        <ExportReactSearchKitResults exportBaseUrl={itemApi.searchBaseURL} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'items'}
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

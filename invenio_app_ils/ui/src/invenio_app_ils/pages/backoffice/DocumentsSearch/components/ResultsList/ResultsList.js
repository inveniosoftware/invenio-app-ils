import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { ExportReactSearchKitResults } from '../../../components';
import { document as documentApi } from '../../../../../common/api';

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
        'Past Loans Count',
      ]);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const headerActionComponent = (
      <div>
        <NewButton
          text={'New document'}
          clickHandler={() => {
            // TODO: EDITOR, implement create form
          }}
        />
        <ExportReactSearchKitResults exportBaseUrl={documentApi.url} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'documents'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.props.viewDetailsClickHandler}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { ExportReactSearchKitResults } from '../../../components';
import { documentRequest as documentRequestApi } from '../../../../../common/api';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData(data) {
    return data.map(row => {
      return pick(formatter.documentRequest.toTable(row), [
        'ID',
        'Created',
        'Updated',
        'State',
        'Patron ID',
        'Document ID',
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
          text={'New document request'}
          clickHandler={() => {
            // TODO: EDITOR, implement create form
          }}
        />
        <ExportReactSearchKitResults exportBaseUrl={documentRequestApi.url} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'document request'}
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

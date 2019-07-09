import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { Button } from 'semantic-ui-react';

import { invenioConfig, ES_MAX_SIZE } from '../../../../../common/config';
import { loan as loanApi } from '../../../../../common/api/';
import { Loader, Error, ResultsTable } from '../../../../../common/components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';

export default class PatronCurrentLoans extends Component {
  componentDidMount() {
    const { patronPid } = this.props;
    this.props.fetchPatronCurrentLoans(patronPid);
  }

  handleShowAllClick() {
    const { patronPid } = this.props;
    const query = loanApi
      .query()
      .withPatronPid(patronPid)
      .withState(invenioConfig.circulation.loanActiveStates)
      .withSize(ES_MAX_SIZE)
      .sortByNewest()
      .qs();
    this.showMaxRows = ES_MAX_SIZE;
    this.props.fetchPatronCurrentLoans(patronPid, query);
  }

  showAllButton = () => {
    return (
      <Button size="tiny" onClick={() => this.handleShowAllClick()}>
        Show all
      </Button>
    );
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Item barcode',
        'Start date',
        'End date',
        'Renewals',
      ]);
    });
  }

  render() {
    const { data, isLoading, hasError, error } = this.props;
    const rows =
      !hasError && !isLoading && !isEmpty(data)
        ? this.prepareData(this.props.data)
        : [];
    rows.totalHits = data.total;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            rows={rows}
            title={'Your current loans'}
            name={'current loans'}
            showMaxRows={this.showMaxRows}
            seeAllComponent={this.showAllButton()}
          />
        </Error>
      </Loader>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

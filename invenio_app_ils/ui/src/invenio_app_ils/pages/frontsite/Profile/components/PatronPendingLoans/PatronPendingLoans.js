import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { Button } from 'semantic-ui-react';

import { ES_MAX_SIZE } from '../../../../../common/config';
import { loan as loanApi } from '../../../../../common/api/';
import { Loader, Error, ResultsTable } from '../../../../../common/components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';

export default class PatronPendingLoans extends Component {
  componentDidMount() {
    const { patronPid } = this.props;
    this.props.fetchPatronPendingLoans(patronPid);
  }

  handleShowAllClick() {
    const { patronPid } = this.props;
    const query = loanApi
      .query()
      .withPatronPid(patronPid)
      .withState('PENDING')
      .withSize(ES_MAX_SIZE)
      .qs();
    this.showMaxRows = ES_MAX_SIZE;
    this.props.fetchPatronPendingLoans(patronPid, query);
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
        'Updated',
        'Document ID',
        'Start date',
        'Expiration date',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Your loan requests'}
        name={'loan requests'}
        showMaxRows={this.showMaxRows}
        seeAllComponent={this.showAllButton()}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(data)}</Error>
      </Loader>
    );
  }
}

PatronPendingLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

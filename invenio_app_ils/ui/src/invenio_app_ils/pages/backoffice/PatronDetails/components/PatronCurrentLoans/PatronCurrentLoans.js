import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';

import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import { goTo, goToHandler } from '../../../../../history';

import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default class PatronCurrentLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronCurrentLoans = props.fetchPatronCurrentLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const patronPid = this.props.patron ? this.props.patron : null;
    this.fetchPatronCurrentLoans(patronPid);
  }

  seeAllButton = () => {
    const { patron } = this.props;
    const path = this.seeAllUrl(
      loanApi
        .query()
        .withPatronPid(patron)
        .withState('ITEM_ON_LOAN')
        .sortByNewest()
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
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
            title={"Patron's current loans"}
            name={'current loans'}
            rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patron: PropTypes.string,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronCurrentLoans.defaultProps = {
  showMaxLoans: 5,
};

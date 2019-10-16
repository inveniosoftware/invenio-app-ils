import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default class PatronCurrentLoans extends Component {
  componentDidMount() {
    const patronPid = this.props.patronPid ? this.props.patronPid : null;
    this.props.fetchPatronCurrentLoans(patronPid);
  }

  seeAllButton = () => {
    const { patronPid } = this.props;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withPatronPid(patronPid)
        .withState(invenioConfig.circulation.loanActiveStates)
        .sortByNewest()
        .qs()
    );
    return <SeeAllButton url={path} />;
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
            rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patronPid: PropTypes.string,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronCurrentLoans.defaultProps = {
  showMaxLoans: 5,
};

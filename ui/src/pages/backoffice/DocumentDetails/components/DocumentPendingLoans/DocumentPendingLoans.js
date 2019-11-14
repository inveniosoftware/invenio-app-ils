import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { loan as loanApi } from '@api';
import { dateFormatter } from '@api/date';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '../../../components/buttons';

export default class DocumentPendingLoans extends Component {
  componentDidMount() {
    const { pid } = this.props.document;
    this.props.fetchPendingLoans(pid);
  }

  seeAllButton = () => {
    const { pid } = this.props.document;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withDocPid(pid)
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.loanDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderTable(data) {
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      {
        title: 'Patron',
        field: 'metadata.patron.name',
        formatter: ({ row }) => (
          <Link to={BackOfficeRoutes.patronDetailsFor(row.metadata.patron_pid)}>
            {row.metadata.patron.name}
          </Link>
        ),
      },
      {
        title: 'Request start date',
        field: 'metadata.request_start_date',
        formatter: dateFormatter,
      },
      {
        title: 'Request end date',
        field: 'metadata.request_expire_date',
        formatter: dateFormatter,
      },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        title={'Pending loans requests'}
        name={'pending loan requests'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxPendingLoans}
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

DocumentPendingLoans.propTypes = {
  document: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxPendingLoans: PropTypes.number,
};

DocumentPendingLoans.defaultProps = {
  showMaxPendingLoans: 5,
};

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '../../../../../common/components';
import { documentRequest as documentRequestApi } from '../../../../../common/api/';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { dateFormatter } from '../../../../../common/api/date';
import { SeeAllButton } from '../../../components/buttons';

export default class PatronDocumentRequests extends Component {
  componentDidMount() {
    const patronPid = this.props.patronPid ? this.props.patronPid : null;
    this.props.fetchPatronDocumentRequests(patronPid);
  }

  seeAllButton = () => {
    const { patronPid } = this.props;
    const path = BackOfficeRoutes.documentRequestsListWithQuery(
      documentRequestApi
        .query()
        .withPatronPid(patronPid)
        .sortByNewest()
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.documentRequestDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Document ID', field: 'metadata.document_pid' },
      { title: 'State', field: 'metadata.state' },
      { title: 'Created', field: 'created', formatter: dateFormatter },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={data.hits}
            columns={columns}
            totalHitsCount={data.total}
            title={"Patron's new book requests"}
            name={'new book requests'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={this.props.showMaxDocumentRequests}
          />
        </Error>
      </Loader>
    );
  }
}

PatronDocumentRequests.propTypes = {
  patronPid: PropTypes.string,
  fetchPatronDocumentRequests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxDocumentRequests: PropTypes.number,
};

PatronDocumentRequests.defaultProps = {
  showMaxDocumentRequests: 5,
};

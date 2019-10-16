import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import { documentRequest as documentRequestApi } from '../../../../../common/api/';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

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
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.documentRequest.toTable(row), [
        'ID',
        'Document ID',
        'State',
        'Created',
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
            title={"Patron's new book requests"}
            name={'new book requests'}
            rowActionClickHandler={BackOfficeRoutes.documentRequestDetailsFor}
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

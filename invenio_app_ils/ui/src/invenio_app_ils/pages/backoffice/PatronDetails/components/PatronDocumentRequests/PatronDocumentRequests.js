import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { documentRequest as documentRequestApi } from '../../../../../common/api/';

import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import { goTo, goToHandler } from '../../../../../history';

import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default class PatronDocumentRequests extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronDocumentRequests = props.fetchPatronDocumentRequests;
    this.showDetailsUrl = BackOfficeRoutes.documentRequestDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentRequestsListWithQuery;
  }

  componentDidMount() {
    const patronPid = this.props.patronPid ? this.props.patronPid : null;
    this.fetchPatronDocumentRequests(patronPid);
  }

  seeAllButton = () => {
    const { patronPid } = this.props;
    const path = this.seeAllUrl(
      documentRequestApi
        .query()
        .withPatronPid(patronPid)
        .sortByNewest()
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.documentRequest.toTable(row), [
        'ID',
        'Patron ID',
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
            title={"Patron's document requests"}
            name={'document requests'}
            rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
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

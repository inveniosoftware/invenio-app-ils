import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { document as documentApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';
import pick from 'lodash/pick';

export default class OverbookedDocumentsList extends Component {
  constructor(props) {
    super(props);
    this.fetchOverbookedDocuments = props.fetchOverbookedDocuments;
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
  }

  componentDidMount() {
    this.fetchOverbookedDocuments();
  }

  _showDetailsHandler = document_pid =>
    this.props.history.push(this.showDetailsUrl(document_pid));

  _seeAllButton = () => {
    const _click = () =>
      this.props.history.push(
        this.seeAllUrl(
          documentApi
            .query()
            .overbooked()
            .qs()
        )
      );

    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let entry = formatter.document.toTable(row);
      return pick(entry, ['ID', 'Title', 'Requests', 'Items']);
    });
  }

  _render_table(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Overbooked documents'}
        subtitle={
          'Documents with more requests than the number of available items for loan.'
        }
        name={'overbooked documents'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
        fixed
        singleLine
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._render_table(data)}</Error>
      </Loader>
    );
  }
}

OverbookedDocumentsList.propTypes = {
  fetchOverbookedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

OverbookedDocumentsList.defaultProps = {
  showMaxEntries: 5,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable } from '../../../../../common/components';
import './AvailableItems.scss';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { item as itemApi } from '../../../../../common/api';
import { SeeAllButton } from '../../../components/buttons/SeeAllButton';
import pick from 'lodash/pick';

export default class AvailableItems extends Component {
  constructor(props) {
    super(props);
    this.fetchAvailableItems = props.fetchAvailableItems;
    this.assignItemToLoan = props.assignItemToLoan;
  }

  componentDidMount() {
    this.fetchAvailableItems(this.props.loan.metadata.document_pid);
  }

  _showDetailsHandler = item_pid =>
    this.props.history.push(this.showDetailsUrl(item_pid));

  _seeAllButton = () => {
    const { document_pid } = this.props.loan.metadata;
    const _click = () =>
      this.props.history.push(
        this.seeAllUrl(
          itemApi
            .query()
            .withDocPid(document_pid)
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => _click()} />;
  };

  _assignItemButton(item) {
    return (
      <Button
        size="mini"
        color="teal"
        onClick={() => {
          this.assignItemToLoan(item.id, this.props.loan.loan_pid);
        }}
      >
        assign
      </Button>
    );
  }

  prepareData(data) {
    return data.hits.map(row => {
      const entry = formatter.item.toTable(row);
      entry['Actions'] = this._assignItemButton(row);
      return pick(entry, [
        'ID',
        'Barcode',
        'Status',
        'Medium',
        'Location',
        'Shelf',
        'Actions',
      ]);
    });
  }

  _renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Available items'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._renderTable(data)}</Error>
      </Loader>
    );
  }
}

AvailableItems.propTypes = {
  assignItemToLoan: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  loan: PropTypes.object.isRequired,
  fetchAvailableItems: PropTypes.func.isRequired,
  showMaxAvailableItems: PropTypes.number,
};

AvailableItems.defaultProps = {
  showMaxAvailableItems: 10,
};

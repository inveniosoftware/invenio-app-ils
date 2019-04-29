import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable } from '../../../../../common/components';
import './AvailableItems.scss';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { item as itemApi } from '../../../../../common/api';
import { SeeAllButton } from '../../../components/buttons/SeeAllButton';
import pick from 'lodash/pick';
import { BackOfficeRoutes } from '../../../../../routes/urls';

export default class AvailableItems extends Component {
  constructor(props) {
    super(props);
    this.fetchAvailableItems = props.fetchAvailableItems;
    this.assignItemToLoan = props.assignItemToLoan;
    this.assignItemAndCheckout = props.assignItemAndCheckout;
    this.showDetailsUrl = BackOfficeRoutes.itemDetailsFor;
  }

  componentDidMount() {
    this.fetchAvailableItems(this.props.loan.metadata.document_pid);
  }

  _showDetailsHandler = itemPid =>
    this.props.history.push(this.showDetailsUrl(itemPid));

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
          this.assignItemToLoan(
            item.metadata.item_pid,
            this.props.loan.loan_pid
          );
        }}
      >
        assign
      </Button>
    );
  }

  _checkoutItemButton(item, loan) {
    return (
      <Button
        size="mini"
        color="teal"
        onClick={() => {
          this.assignItemAndCheckout(
            this.props.loan.loan_pid,
            loan,
            loan.availableActions.checkout,
            item.metadata.item_pid
          );
        }}
      >
        checkout
      </Button>
    );
  }

  prepareData(data) {
    return data.hits.map(row => {
      const entry = formatter.item.toTable(row);
      entry['Actions'] = this._rowActionButton(row);
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
        name={'available items'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  _rowActionButton(row) {
    const { loan } = this.props;
    if (loan.metadata.state === 'PENDING') {
      return this._checkoutItemButton(row, loan);
    } else {
      return this._assignItemButton(row);
    }
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

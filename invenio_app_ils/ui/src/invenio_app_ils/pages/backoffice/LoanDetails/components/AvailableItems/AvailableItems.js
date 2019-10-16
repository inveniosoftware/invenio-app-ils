import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import {} from '../../../../../common/components/ResultsTable/formatters';
import { item as itemApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { SeeAllButton } from '../../../components/buttons/SeeAllButton';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import pick from 'lodash/pick';

export default class AvailableItems extends Component {
  componentDidMount() {
    this.props.fetchAvailableItems(this.props.loan.metadata.document_pid);
  }

  seeAllButton = () => {
    const { document_pid } = this.props.loan.metadata;
    const path = BackOfficeRoutes.itemsListWithQuery(
      itemApi
        .query()
        .withDocPid(document_pid)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  assignItemButton(item) {
    return (
      <Button
        size="mini"
        color="teal"
        onClick={() => {
          this.props.assignItemToLoan(item.metadata.pid, this.props.loan.pid);
        }}
      >
        assign
      </Button>
    );
  }

  checkoutItemButton(item, loan) {
    return (
      <Button
        size="mini"
        color="teal"
        onClick={() => {
          const checkoutUrl = loan.availableActions.checkout;
          const patronPid = loan.metadata.patron_pid;
          const documentPid = item.metadata.document.pid;
          const itemPid = item.metadata.pid;
          this.props.performCheckoutAction(
            checkoutUrl,
            documentPid,
            patronPid,
            itemPid
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
      entry['Actions'] = this.rowActionButton(row);
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

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Available items'}
        name={'available items'}
        rowActionClickHandler={BackOfficeRoutes.itemDetailsFor}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  rowActionButton(row) {
    const { loan } = this.props;
    const isRequested = invenioConfig.circulation.loanRequestStates.includes(
      loan.metadata.state
    );
    if (isRequested) {
      return this.checkoutItemButton(row, loan);
    } else {
      return this.assignItemButton(row);
    }
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

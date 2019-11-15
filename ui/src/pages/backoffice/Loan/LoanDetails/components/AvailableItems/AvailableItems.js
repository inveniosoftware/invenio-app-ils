import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable } from '@components';
import { item as itemApi } from '@api';
import { invenioConfig } from '@config';
import { SeeAllButton } from '@pages/backoffice/components/buttons/SeeAllButton';
import { BackOfficeRoutes } from '@routes/urls';

export default class AvailableItems extends Component {
  constructor(props) {
    super(props);
    this.fetchAvailableItems = props.fetchAvailableItems;
    this.assignItemToLoan = props.assignItemToLoan;
    this.performCheckoutAction = props.performCheckoutAction;
    this.seeAllUrl = BackOfficeRoutes.itemsListWithQuery;
  }

  componentDidMount() {
    this.fetchAvailableItems(this.props.loan.metadata.document_pid);
  }

  seeAllButton = () => {
    const { document_pid } = this.props.loan.metadata;
    const path = this.seeAllUrl(
      itemApi
        .query()
        .withDocPid(document_pid)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  assignItemButton(item) {
    return (
      <Button
        size="mini"
        color="teal"
        onClick={() => {
          this.assignItemToLoan(item.metadata.pid, this.props.loan.pid);
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
          this.performCheckoutAction(
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

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.itemDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderTable() {
    const { data } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      {
        title: 'Barcode',
        field: 'metadata.barcode',
        formatter: ({ row }) => (
          <Link to={BackOfficeRoutes.itemDetailsFor(row.metadata.pid)}>
            {row.metadata.barcode}
          </Link>
        ),
      },
      { title: 'Status', field: 'metadata.status' },
      { title: 'Medium', field: 'metadata.medium' },
      { title: 'Location', field: 'metadata.internal_location.name' },
      { title: 'Shelf', field: 'metadata.shelf' },
      {
        title: 'Actions',
        field: '',
        formatter: this.rowActionButton,
      },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        title={'Available items'}
        name={'available items'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  rowActionButton = ({ row }) => {
    const { loan } = this.props;
    const isRequested = invenioConfig.circulation.loanRequestStates.includes(
      loan.metadata.state
    );
    if (isRequested) {
      return this.checkoutItemButton(row, loan);
    } else {
      return this.assignItemButton(row);
    }
  };

  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable()}</Error>
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

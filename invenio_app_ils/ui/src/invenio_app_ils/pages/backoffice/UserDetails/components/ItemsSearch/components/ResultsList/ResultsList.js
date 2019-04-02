import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { ResultsTableFormatter as formatter } from '../../../../../../../common/components';
import { invenioConfig } from '../../../../../../../common/config';
import _isEmpty from 'lodash/isEmpty';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
  }

  actions(item, itemState) {
    const circulationStatus = !_isEmpty(item.circulation_status)
      ? item.circulation_status
      : null;
    if (
      !invenioConfig.circulation.loanActiveStates.includes(circulationStatus) &&
      invenioConfig.items.available.status.includes(itemState)
    ) {
      return (
        <Button
          content={'Checkout'}
          onClick={() => {
            this.checkoutItem(item, this.props.patron).then(() => {
              this.clearResults();
              setTimeout(() => {
                this.fetchPatronCurrentLoans(this.props.patron);
              }, 3000);
            });
          }}
        />
      );
    }
    return <Button disabled content={'Force checkout'} />;
  }

  prepareData() {
    return this.props.results.hits.map(row => {
      let serialised = formatter.item.toTable(row);
      serialised['Actions'] = this.actions(row, row.status);
      delete serialised['Created'];
      delete serialised['Updated'];
      delete serialised['Internal location'];
      return serialised;
    });
  }

  render() {
    const rows = this.prepareData();
    return rows.length ? (
      <ResultsTable
        rows={rows}
        name={''}
        actionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.object.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patron: PropTypes.number.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
};

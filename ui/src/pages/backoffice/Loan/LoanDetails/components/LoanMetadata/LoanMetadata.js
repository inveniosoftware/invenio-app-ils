import { invenioConfig } from '@config';
import { getDisplayVal } from '@config/invenioConfig';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon, Label } from 'semantic-ui-react';
import {
  MetadataTable,
  PatronDetailsLink,
  LocationsLink,
  ItemIcon,
  DocumentIcon,
  PatronIcon,
} from '@pages/backoffice/components';
import isEmpty from 'lodash/isEmpty';
import { toShortDate, toShortDateTime } from '@api/date';
import { LoanLinkToItem } from '../../../../components/Loan';
import { DocumentTitle } from '@components/Document';

export default class LoanMetadata extends Component {
  prepareLeftData(data) {
    return [
      {
        name: 'State',
        value: (
          <Label basic color="blue" size="tiny">
            {getDisplayVal('circulation.statuses', data.metadata.state)}
          </Label>
        ),
      },
      {
        name: (
          <>
            <DocumentIcon />
            Document
          </>
        ),
        value: <DocumentTitle metadata={data.metadata.document} />,
      },
      {
        name: (
          <>
            <ItemIcon />
            Physical copy
          </>
        ),
        value: data.metadata.item_pid ? (
          <LoanLinkToItem itemPid={data.metadata.item_pid}>
            {data.metadata.item_pid && data.metadata.item_pid.type === 'illbid'
              ? 'ILL'
              : data.metadata.item.barcode}
          </LoanLinkToItem>
        ) : (
          '-'
        ),
      },
      {
        name: (
          <>
            <PatronIcon />
            Patron
          </>
        ),
        value: (
          <PatronDetailsLink patronPid={data.metadata.patron_pid}>
            {data.metadata.patron.name}
          </PatronDetailsLink>
        ),
      },
      {
        name: 'Pickup location',
        value: (
          <LocationsLink locationPid={data.metadata.pickup_location_pid}>
            {data.metadata.pickup_location.name}
          </LocationsLink>
        ),
      },
      {
        name: 'Delivery',
        value: this.getDelivery(data.metadata.delivery),
      },
    ];
  }

  getDelivery(delivery) {
    if (delivery && 'method' in delivery) {
      return invenioConfig.circulation.deliveryMethods[delivery.method];
    }
    return 'NOT PROVIDED';
  }

  prepareRightData(data) {
    const { cancel_reason: reason, state } = data.metadata;
    const rows = [
      {
        name: 'Transaction date',
        value: toShortDateTime(data.metadata.transaction_date),
      },
    ];
    if (
      invenioConfig.circulation.loanRequestStates.includes(data.metadata.state)
    ) {
      rows.push(
        {
          name: 'Period of interest starts',
          value: toShortDateTime(data.metadata.request_start_date),
        },
        {
          name: 'Period of interest ends',
          value: toShortDate(data.metadata.request_expire_date),
        }
      );
    } else {
      rows.push(
        {
          name: 'Start date',
          value: toShortDate(data.metadata.start_date),
        },
        {
          name: 'End date',
          value: (
            <>
              {toShortDate(data.metadata.end_date)}
              {data.metadata.is_overdue && <Icon name="warning" />}
            </>
          ),
        }
      );
    }
    rows.push({ name: 'Extensions', value: data.metadata.extension_count });
    if (state === 'CANCELLED' && !isEmpty(reason)) {
      rows.push({
        name: 'Cancel Reason',
        value: reason,
      });
    }
    return rows;
  }

  render() {
    const data = this.props.loanDetails;
    const leftRows = this.prepareLeftData(data);
    const rightRows = this.prepareRightData(data);
    return (
      <Grid padded columns={2}>
        <Grid.Column>
          <MetadataTable key="left" rows={leftRows} />
        </Grid.Column>
        <Grid.Column>
          <MetadataTable key="right" rows={rightRows} />
        </Grid.Column>
      </Grid>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};

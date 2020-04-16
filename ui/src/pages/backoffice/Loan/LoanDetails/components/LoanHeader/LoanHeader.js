import { toShortDate } from '@api/date';
import { CopyButton, DocumentAuthors } from '@components';
import { DocumentTitle } from '@components/Document';
import { getDisplayVal } from '@config/invenioConfig';
import {
  DetailsHeader,
  DocumentDetailsLink,
  LoanIcon,
  PatronIcon,
} from '@pages/backoffice/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Label } from 'semantic-ui-react';

export default class LoanHeader extends Component {
  render() {
    const { data } = this.props;

    const labels = (
      <div className="bo-details-header-status-labels">
        <Label basic color="blue">
          {getDisplayVal('circulation.statuses', data.metadata.state)}
        </Label>
        {data.metadata.is_overdue && <Label color="red">Overdue</Label>}
        {data.metadata.item_pid && data.metadata.item_pid.type === 'illbid' && (
          <Label basic color="teal">
            ILL
          </Label>
        )}
      </div>
    );

    const recordInfo = (
      <>
        <label className="muted">Loan</label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        <br />
        <label className="muted">Created on</label> {toShortDate(data.created)}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>
              <PatronIcon />
              {data.metadata.patron.name}
            </Header.Subheader>
            Loan #{data.metadata.pid} {labels}
          </>
        }
        subTitle={
          <>
            on:{' '}
            <DocumentDetailsLink pidValue={data.metadata.document_pid}>
              {' '}
              <DocumentTitle metadata={data.metadata.document} />
            </DocumentDetailsLink>
            <DocumentAuthors
              metadata={data.metadata.document}
              prefix={'by: '}
            />
          </>
        }
        icon={<LoanIcon />}
        recordInfo={recordInfo}
      />
    );
  }
}

LoanHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

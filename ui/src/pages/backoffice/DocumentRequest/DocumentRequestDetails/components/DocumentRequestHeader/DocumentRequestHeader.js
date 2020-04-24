import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BackOfficeRoutes } from '@routes/urls';
import { Label } from 'semantic-ui-react';
import { toShortDate } from '@api/date';
import { CopyButton } from '@components';
import { DocumentRequestIcon } from '@pages/backoffice/components/icons';
import { DetailsHeader } from '@pages/backoffice/components';

export default class DocumentRequestHeader extends Component {
  renderStatus(status) {
    switch (status) {
      case 'REJECTED':
        return <Label color="grey">Rejected</Label>;
      case 'PENDING':
        return <Label color="yellow">Pending</Label>;
      case 'ACCEPTED':
        return <Label color="green">Accepted</Label>;
      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  recordInfo = () => {
    const { data } = this.props;
    return (
      <>
        <Label className="muted">Request</Label> {data.metadata.pid}
        <CopyButton text={data.metadata.pid} />
        <br />
        <Label className="muted">Created on</Label> {toShortDate(data.created)}
      </>
    );
  };

  patronLink(patron) {
    return (
      <>
        by{' '}
        <Link to={BackOfficeRoutes.patronDetailsFor(patron.id)}>
          {patron.name}
        </Link>
      </>
    );
  }

  render() {
    const { data } = this.props;
    return (
      <DetailsHeader
        title={
          <>
            Request for new literature {this.renderStatus(data.metadata.state)}
          </>
        }
        subTitle={this.patronLink(data.metadata.patron)}
        pid={data.metadata.pid}
        icon={<DocumentRequestIcon />}
        recordInfo={this.recordInfo()}
      />
    );
  }
}

DocumentRequestHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

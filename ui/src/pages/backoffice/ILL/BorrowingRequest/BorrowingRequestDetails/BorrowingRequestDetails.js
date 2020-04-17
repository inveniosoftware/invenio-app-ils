import { toShortDate } from '@api/date';
import { CopyButton, CreatedBy, Error, Loader } from '@components';
import { DetailsHeader, EditButton } from '@pages/backoffice/components';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import { ILLBorrowingRequestIcon } from '@pages/backoffice/components/icons';
import { ILLRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Divider,
  Grid,
  Label,
  Message,
  Ref,
  Sticky,
} from 'semantic-ui-react';
import { BorrowingRequestMetadata } from './BorrowingRequestMetadata';
import { BorrowingRequestPayment } from './BorrowingRequestPayment';
import { BorrowingRequestStatistics } from './BorrowingRequestStatistics';

class BorrowingRequestHeader extends React.Component {
  renderStatus(status) {
    switch (status) {
      case 'PENDING':
        return <Label color="yellow">Pending</Label>;
      case 'REQUESTED':
        return <Label color="yellow">Requested</Label>;
      case 'ON_LOAN':
        return <Label color="green">On loan</Label>;
      case 'RETURNED':
        return <Label color="grey">Returned</Label>;
      case 'CANCELLED':
        return <Label color="grey">Cancelled</Label>;
      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  render() {
    const { brwReq } = this.props;
    const library = brwReq.library;
    const libraryLink = (
      <Link to={ILLRoutes.libraryDetailsFor(library.pid)}>{library.name}</Link>
    );
    const pid = brwReq.pid;
    const recordInfo = (
      <>
        <label>Borrowing request</label> #{pid} <CopyButton text={pid} />
        {brwReq.created_by && (
          <>
            <br />
            <label className="muted">Created by</label>{' '}
            <CreatedBy brwReq={brwReq} />
          </>
        )}
        <br />
        <label>Request date</label>{' '}
        {brwReq.request_date ? toShortDate(brwReq.request_date) : '-'}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            Borrowing request #{brwReq.pid} {this.renderStatus(brwReq.status)}
          </>
        }
        subTitle={<>From library: {libraryLink}</>}
        pid={brwReq.pid}
        icon={<ILLBorrowingRequestIcon />}
        recordType="BorrowingRequest"
        recordInfo={recordInfo}
      />
    );
  }
}

class ActionMenu extends React.Component {
  render() {
    const { brwReq } = this.props;

    return (
      <div className={'bo-action-menu'}>
        <EditButton fluid to={ILLRoutes.borrowingRequestEditFor(brwReq.pid)} />

        <Message size="small">
          <Message.Header>Borrowing request deletion</Message.Header>
          <p>
            Borrowing requests cannot be deleted. You can cancel this borrowing
            request by changing its status when editing.
          </p>
        </Message>

        <Divider horizontal>Navigation</Divider>

        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem
            elementId="request-info"
            label="Request information"
          />
          <ScrollingMenuItem
            elementId="payment-info"
            label="Payment information"
          />
        </ScrollingMenu>
      </div>
    );
  }
}

export default class BorrowingRequestDetails extends Component {
  constructor(props) {
    super(props);

    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchBorrowingRequestDetails(
      this.props.match.params.borrowingRequestPid
    );
  }

  componentDidUpdate(prevProps) {
    const borrowingRequestPid = this.props.match.params.borrowingRequestPid;
    const samePidFromRouter =
      prevProps.match.params.borrowingRequestPid === borrowingRequestPid;
    if (!samePidFromRouter) {
      this.props.fetchBorrowingRequestDetails(borrowingRequestPid);
    }
  }

  render() {
    const { isLoading, error, data } = this.props;
    const metadata = data.metadata || {};
    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <BorrowingRequestHeader brwReq={metadata} />
                </Container>
                <Divider />
              </Sticky>

              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container fluid className="spaced">
                        <BorrowingRequestStatistics brwReq={metadata} />
                      </Container>
                      <Container>
                        <BorrowingRequestMetadata brwReq={metadata} />
                        <BorrowingRequestPayment brwReq={metadata} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu brwReq={metadata} offset={-150} />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

BorrowingRequestDetails.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  fetchBorrowingRequestDetails: PropTypes.func.isRequired,
};

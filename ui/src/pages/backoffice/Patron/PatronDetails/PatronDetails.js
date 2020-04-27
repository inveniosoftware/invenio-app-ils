import { Error, Loader } from '@components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Container,
  Divider,
  Grid,
  Header,
  Ref,
  Segment,
  Sticky,
} from 'semantic-ui-react';
import {
  ItemsCheckout,
  ItemsSearch,
  PatronCurrentLoans,
  PatronDocumentRequests,
  PatronPendingLoans,
  PatronActionMenu,
  PatronHeader,
  PatronPastLoans,
  PatronCurrentBorrowingRequests,
  PatronPastBorrowingRequests,
} from './components';

export default class PatronDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronDetails = this.props.fetchPatronDetails;
    this.menuRef = React.createRef();
    this.headerRef = React.createRef();
  }

  componentDidMount() {
    this.fetchPatronDetails(this.props.match.params.patronPid);
  }

  componentDidUpdate(prevProps, prevState) {
    const currentPatronPid = this.props.match.params.patronPid;
    const samePatronPidFromRouter =
      prevProps.match.params.patronPid === currentPatronPid;
    if (!samePatronPidFromRouter) {
      this.fetchPatronDetails(currentPatronPid);
    }
  }

  render() {
    const { isLoading, error, data } = this.props;
    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <PatronHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container className="spaced">
                        <Header attached="top" as={'h3'}>
                          Checkout
                        </Header>
                        <Segment
                          attached
                          className="bo-metadata-segment"
                          id="patron-checkout"
                        >
                          <ItemsCheckout />
                          <ItemsSearch />
                        </Segment>

                        <Container className="spaced">
                          <Header attached="top" as={'h3'}>
                            Ongoing loans
                          </Header>
                          <Segment
                            attached
                            id="ongoing-loans"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronCurrentLoans />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Pending loans requests
                          </Header>
                          <Segment
                            attached
                            id="loan-requests"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronPendingLoans />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Ongoing interlibrary loans
                          </Header>
                          <Segment
                            attached
                            id="ongoing-borrowing-requests"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronCurrentBorrowingRequests />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Requests for new literature
                          </Header>
                          <Segment
                            attached
                            id="literature-requests"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronDocumentRequests />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Loans history
                          </Header>
                          <Segment
                            attached
                            id="loans-history"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronPastLoans />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Interlibrary loans history
                          </Header>
                          <Segment
                            attached
                            id="borrowing-requests-history"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronPastBorrowingRequests />
                          </Segment>
                        </Container>
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <Divider horizontal> Navigation </Divider>
                        <PatronActionMenu offset={-150} />
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

PatronDetails.propTypes = {
  fetchPatronDetails: PropTypes.func.isRequired,
};

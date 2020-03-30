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
                            Patron's current loans
                          </Header>
                          <Segment
                            attached
                            id="current-loans"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronCurrentLoans />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Patron's loan requests
                          </Header>
                          <Segment
                            attached
                            id="loan-requests"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronPendingLoans />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Patron's literature requests
                          </Header>
                          <Segment
                            attached
                            id="literature-requests"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronDocumentRequests />
                          </Segment>
                          <Header attached="top" as={'h3'}>
                            Patron's loans history
                          </Header>
                          <Segment
                            attached
                            id="loans-history"
                            className="bo-metadata-segment no-padding"
                          >
                            <PatronPastLoans />
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

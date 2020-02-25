import { DocumentContent } from './DocumentContent';
import { DocumentHeader } from './DocumentHeader';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Grid, Ref, Sticky } from 'semantic-ui-react';
import history from '@history';
import { Loader, Error } from '@components';
import {
  DocumentMetadata,
  DocumentActionMenu,
  DocumentSummary,
} from './components';

export default class DocumentDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;

    this.menuRef = React.createRef();
    this.headerRef = React.createRef();

    this.anchors = {
      summaryRef: React.createRef(),
      loanRequestsRef: React.createRef(),
      attachedItemsRef: React.createRef(),
      attachedEItemsRef: React.createRef(),
      seriesRef: React.createRef(),
      relatedRef: React.createRef(),
      statisticsRef: React.createRef(),
    };
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Document') {
        this.fetchDocumentDetails(loc.state.pid);
      }
    });
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
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
                  <DocumentHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container className="spaced">
                        <Container className="spaced">
                          <div
                            ref={this.anchors.summaryRef}
                            id="document-summary"
                          >
                            <DocumentSummary
                              anchors={this.anchors}
                              document={data}
                            />
                          </div>
                        </Container>
                        <DocumentMetadata anchors={this.anchors} />
                        <DocumentContent anchors={this.anchors} data={data} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={200}>
                        <DocumentActionMenu offset={-250} />
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

DocumentDetails.propTypes = {
  fetchDocumentDetails: PropTypes.func.isRequired,
};

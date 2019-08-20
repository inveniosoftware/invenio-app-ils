import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Image,
  Responsive,
  Container,
  Label,
  Button,
  Popup,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DocumentTab from '../DocumentTab';
import '../../DocumentsDetails.scss';
import { BookAttachments, ShareButtons } from '../../../components';
import { BookInfo } from '../../../components/BookInfo';
import { BookSeries } from '../../../components/BookSeries';
import { EitemsButton } from '../../../components/EitemsButton';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentsDetails;
  }

  requestLoan = () => {
    const documentPid = this.document.pid;
    this.props.requestLoanForDocument(documentPid);
  };

  requestLoanButton = (
    <Button
      positive
      size="small"
      content="Request Loan"
      onClick={this.requestLoan}
    />
  );

  requestLoanPopup = (
    <Popup
      content="Request a loan on this document"
      trigger={<Icon name="info circle" size="large" />}
    />
  );

  renderBookAvailabilityLabel = () => {
    const circulationData = this.document.metadata.circulation;
    return (
      <Label
        color={circulationData.has_items_for_loan ? 'green' : 'red'}
        content="Available copies"
        detail={circulationData.has_items_for_loan}
      />
    );
  };

  renderNextAvailableDateLabel = () => {
    const circulationData = this.document.metadata.circulation;
    return circulationData.next_available_date ? (
      <Label
        color="yellow"
        content="Available from"
        detail={circulationData.next_available_date}
      />
    ) : null;
  };

  render() {
    const eitems = this.document.metadata.eitems.hits;
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    return (
      <Segment
        className="document-metadata"
        data-test={this.document.metadata.pid}
      >
        <Grid>
          <Grid.Row>
            <Grid stackable columns={2}>
              <Grid.Column width={3}>
                <Image src={cover} size="medium" />
                <ShareButtons type="mobile" />
              </Grid.Column>

              <Grid.Column width={13}>
                <Grid.Row>
                  <div className="ui hidden divider" />
                  <BookInfo documentMetadata={this.document.metadata} />
                  <div className="ui hidden divider" />
                  <EitemsButton eitems={eitems} />
                  {this.requestLoanButton}
                  {this.requestLoanPopup}
                  <div className="ui hidden divider" />
                  <BookSeries relations={this.document.metadata.relations} />
                </Grid.Row>

                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this.renderBookAvailabilityLabel()}
                  <div className="ui hidden divider" />
                  {this.renderNextAvailableDateLabel()}
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>

          <Grid.Row>
            <Responsive as={Container} {...Responsive.onlyComputer}>
              <Grid columns={2}>
                <BookAttachments
                  documentData={this.document.metadata}
                  displayOption="desktop"
                />

                <DocumentTab documentMetadata={this.document.metadata} />
              </Grid>
            </Responsive>

            <Responsive as={Container} {...Responsive.onlyMobile}>
              <DocumentTab documentMetadata={this.document.metadata} />
              <BookAttachments
                documentData={this.document.metadata}
                displayOption="mobile"
              />
            </Responsive>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  documentsDetails: PropTypes.object.isRequired,
};

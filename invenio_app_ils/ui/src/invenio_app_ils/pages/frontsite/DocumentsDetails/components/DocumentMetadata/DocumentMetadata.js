import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Image,
  Responsive,
  Container,
  Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DocumentTab from '../DocumentTab';
import '../../DocumentsDetails.scss';
import { BookAttachments, ShareButtons } from '../../../components';
import { BookInfo } from '../../../components/BookInfo';
import { BookSeries } from '../../../components/BookSeries';
import { EitemsButton } from '../../../components/EitemsButton';
import { LoginRedirectButton } from '../../../../../authentication/components';
import { LoanRequestForm } from '../LoanRequestForm';
import { AuthenticationGuard } from '../../../../../authentication/components/AuthenticationGuard';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentsDetails;
  }

  loginToLoan = () => {
    return <LoginRedirectButton content={'Login to loan'} />;
  };

  renderBookAvailabilityLabel = () => {
    const circulationData = this.document.metadata.circulation;
    return (
      <Label
        color={circulationData.has_items_for_loan ? 'green' : 'red'}
        content="Copies on shelf"
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

  renderLoanRequestForm = () => {
    return <LoanRequestForm document={this.document} />;
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
                <Responsive as={Container} {...Responsive.onlyComputer}>
                  <EitemsButton eitems={eitems} />
                  <div className="ui hidden divider" />
                  <BookSeries relations={this.document.metadata.relations} />
                  <BookAttachments
                    documentData={this.document.metadata}
                    displayOption="desktop"
                  />
                </Responsive>

                <Responsive as={Container} {...Responsive.onlyMobile}>
                  <DocumentTab documentMetadata={this.document.metadata} />
                  <BookAttachments
                    documentData={this.document.metadata}
                    displayOption="mobile"
                  />
                </Responsive>
              </Grid.Column>

              <Grid.Column width={13}>
                <Grid.Row>
                  <BookInfo documentMetadata={this.document.metadata} />
                  <div className="ui hidden divider" />
                </Grid.Row>

                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this.renderBookAvailabilityLabel()}
                  <div className="ui hidden divider" />
                  {this.renderNextAvailableDateLabel()}
                  <AuthenticationGuard
                    authorizedComponent={this.renderLoanRequestForm}
                    loginComponent={this.loginToLoan}
                  />
                </Grid.Row>

                <div className="ui hidden divider" />
                <Grid.Row>
                  <DocumentTab documentMetadata={this.document.metadata} />
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  documentsDetails: PropTypes.object.isRequired,
};

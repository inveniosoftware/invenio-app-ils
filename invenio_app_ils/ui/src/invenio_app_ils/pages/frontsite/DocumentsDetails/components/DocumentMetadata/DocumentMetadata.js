import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Image,
  Responsive,
  Container,
  Button,
  Header,
  List,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import DocumentTab from '../DocumentTab';
import { RequestNewLoanForm } from './components/RequestNewLoanForm';
import '../../DocumentsDetails.scss';
import isEmpty from 'lodash/isEmpty';
import { goToHandler } from '../../../../../history';
import { FrontSiteRoutes } from '../../../../../routes/urls';
import { document as documentApi } from '../../../../../common/api';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = this.props.documentsDetails;
  }
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  goToSeriesList = seriesPid =>
    goToHandler(
      FrontSiteRoutes.documentsListWithQuery(
        documentApi
          .query()
          .withSeriesPid(seriesPid)
          .qs()
      )
    );

  renderBookInfo() {
    return (
      <div className="document-info">
        <Header as="h2">{this.document.metadata.title}</Header>
        <List>
          {this.document.metadata.authors.map((author, index) => (
            <List.Item as="h4" key={`Key${index}`}>
              Author: {author}
            </List.Item>
          ))}
        </List>
        <List>
          {this.document.metadata.publishers.map((publisher, index) => (
            <List.Item as="h5" key={`Key${index}`}>
              Publisher: {publisher}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }

  renderSerials() {
    if (
      !isEmpty(this.document.metadata.series) &&
      !isEmpty(this.document.metadata.series.serial)
    ) {
      return (
        <div>
          <Header as="h4">Part of the following series:</Header>
          <List>
            {this.document.metadata.series.serial.map((serie, index) => (
              <List.Item
                as="a"
                key={`Key${index}`}
                onClick={this.goToSeriesList(serie.series_pid)}
              >
                {serie.title}
              </List.Item>
            ))}
          </List>
        </div>
      );
    }
  }

  renderMultiparts() {
    if (
      !isEmpty(this.document.metadata.series) &&
      !isEmpty(this.document.metadata.series.multipart)
    ) {
      return (
        <div>
          <Header as="h4">Part of the following multipart monograph:</Header>
          <List>
            {this.document.metadata.series.multipart.map((serie, index) => (
              <List.Item
                as="a"
                key={`Key${index}`}
                onClick={this.goToSeriesList(serie.series_pid)}
              >
                {serie.title}
              </List.Item>
            ))}
          </List>
        </div>
      );
    }
  }

  renderShareButtonsLarge() {
    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Button
            href="https://www.facebook.com/sharer/sharer.php"
            color="facebook"
          >
            <Icon name="facebook" /> Facebook
          </Button>
          <div className="ui hidden divider" />
          <Button href="https://twitter.com/intent/tweet" color="twitter">
            <Icon name="twitter" /> Twitter
          </Button>
          <div className="ui hidden divider" />
          <Button color="linkedin">
            <Icon name="linkedin" /> LinkedIn
          </Button>
        </Responsive>
      </div>
    );
  }

  renderFiles() {
    return this.document.metadata.files ? (
      <div>
        <Header as="h3">Files</Header>
        <List>
          {this.document.metadata.files.map((file, index) => (
            <List.Item href={file} key={`Key${index}`}>
              {file}
            </List.Item>
          ))}
        </List>
        <div className="ui divider" />
      </div>
    ) : null;
  }

  renderLinks() {
    return this.document.metadata.booklinks ? (
      <div>
        <Header as="h3">Links</Header>
        <List>
          {this.document.metadata.booklinks.map((link, index) => (
            <List.Item href={link} key={`Key${index}`}>
              {link}
            </List.Item>
          ))}
        </List>
      </div>
    ) : null;
  }

  renderAttachments() {
    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <Header as="h3">Share and Export</Header>
          {this.renderShareButtonsLarge()}
          <div className="ui hidden divider" />
          <div className="ui hidden divider" />
          <div className="ui divider" />
        </Grid.Row>

        <Grid.Row>{this.renderFiles()}</Grid.Row>

        <Grid.Row>{this.renderLinks()}</Grid.Row>
      </Grid.Column>
    );
  }

  renderShareButtons() {
    return (
      <Responsive {...Responsive.onlyMobile}>
        <div>
          <Button
            href="https://www.facebook.com/sharer/sharer.php"
            circular
            color="facebook"
            icon="facebook"
          />
          <Button
            href="https://twitter.com/intent/tweet"
            circular
            color="twitter"
            icon="twitter"
          />
          <Button circular color="linkedin" icon="linkedin" />
        </div>
      </Responsive>
    );
  }

  renderMainButtons() {
    const { visible } = this.state;
    return (
      <div className="loan-request">
        <Button primary disabled size="large" color="blue">
          Open eBook
        </Button>

        <Responsive {...Responsive.onlyMobile}>
          <div className="ui hidden divider" />
        </Responsive>

        <Button
          primary
          size="large"
          color="blue"
          content={visible ? 'Close' : 'Request Loan'}
          onClick={this.toggleVisibility}
        />

        <div className="ui hidden divider" />

        <RequestNewLoanForm
          docPid={this.document.metadata.document_pid}
          visible={visible}
        />
      </div>
    );
  }

  renderCirculationButtons() {
    const circulationData = this.document.metadata.circulation;
    const buttonColor =
      circulationData.items_available_for_loan > 0 ? 'green' : 'red';
    return (
      <div>
        <Button
          color={buttonColor}
          content="Available copies"
          label={{
            basic: true,
            color: buttonColor,
            pointing: 'left',
            content: circulationData.items_available_for_loan,
          }}
        />

        <Button
          color="yellow"
          content="Active loans"
          label={{
            basic: true,
            color: 'yellow',
            pointing: 'left',
            content: circulationData.active_loans,
          }}
        />

        <Button
          color="yellow"
          content="Reservations"
          label={{
            basic: true,
            color: 'yellow',
            pointing: 'left',
            content: circulationData.pending_loans,
          }}
        />

        {!isEmpty(circulationData.next_available_date) &&
        circulationData.items_available_for_loan === 0 ? (
          <Button
            color="yellow"
            content="Available from"
            label={{
              basic: true,
              color: 'yellow',
              pointing: 'left',
              content: circulationData.next_available_date,
            }}
          />
        ) : null}
      </div>
    );
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    return (
      <Segment className="document-metadata">
        <Grid>
          <Grid.Row>
            <Grid stackable columns={2}>
              <Grid.Column width={3}>
                <Image src={cover} size="medium" />
                {this.renderShareButtons()}
              </Grid.Column>

              <Grid.Column width={13}>
                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this.renderBookInfo()}
                  <div className="ui hidden divider" />
                  {this.renderSerials()}
                  <div className="ui hidden divider" />
                  {this.renderMultiparts()}
                </Grid.Row>

                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this.renderMainButtons()}
                  <div className="ui hidden divider" />
                  {this.renderCirculationButtons()}
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>

          <Grid.Row>
            <Responsive as={Container} {...Responsive.onlyComputer}>
              <Grid columns={2}>
                {this.renderAttachments()}
                <DocumentTab documentData={this.document.metadata} />
              </Grid>
            </Responsive>

            <Responsive as={Container} {...Responsive.onlyMobile}>
              <DocumentTab documentData={this.document.metadata} />
              {this.renderAttachments()}
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

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

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = this.props.documentsDetails;
  }
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  _render_book_info() {
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

  _render_share_buttons_large() {
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

  _render_files() {
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

  _render_links() {
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

  _render_attachments() {
    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <Header as="h3">Share and Export</Header>
          {this._render_share_buttons_large()}
          <div className="ui hidden divider" />
          <div className="ui hidden divider" />
          <div className="ui divider" />
        </Grid.Row>

        <Grid.Row>{this._render_files()}</Grid.Row>

        <Grid.Row>{this._render_links()}</Grid.Row>
      </Grid.Column>
    );
  }

  _renderShareButtons() {
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

  _render_main_buttons() {
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

  _render_circulation_buttons() {
    const circulation_data = this.document.metadata.circulation;
    const button_color =
      circulation_data.items_available_for_loan > 0 ? 'green' : 'red';
    return (
      <div>
        <Button
          color={button_color}
          content="Available copies"
          label={{
            basic: true,
            color: button_color,
            pointing: 'left',
            content: circulation_data.items_available_for_loan,
          }}
        />

        <Button
          color="yellow"
          content="Active loans"
          label={{
            basic: true,
            color: 'yellow',
            pointing: 'left',
            content: circulation_data.active_loans,
          }}
        />

        <Button
          color="yellow"
          content="Reservations"
          label={{
            basic: true,
            color: 'yellow',
            pointing: 'left',
            content: circulation_data.pending_loans,
          }}
        />

        {typeof circulation_data.next_available_date !== 'undefined' ? (
          <Button
            color="yellow"
            content="Available from"
            label={{
              basic: true,
              color: 'yellow',
              pointing: 'left',
              content: circulation_data.next_available_date,
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
                {this._renderShareButtons()}
              </Grid.Column>

              <Grid.Column width={13}>
                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this._render_book_info()}
                  <div className="ui hidden divider" />
                </Grid.Row>

                <Grid.Row>
                  <div className="ui hidden divider" />
                  {this._render_main_buttons()}
                  <div className="ui hidden divider" />
                  {this._render_circulation_buttons()}
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>

          <Grid.Row>
            <Responsive as={Container} {...Responsive.onlyComputer}>
              <Grid columns={2}>
                {this._render_attachments()}
                <DocumentTab documentData={this.document.metadata} />
              </Grid>
            </Responsive>

            <Responsive as={Container} {...Responsive.onlyMobile}>
              <DocumentTab documentData={this.document.metadata} />
              {this._render_attachments()}
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

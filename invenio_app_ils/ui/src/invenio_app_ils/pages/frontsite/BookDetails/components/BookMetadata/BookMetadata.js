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
import BookTab from '../BookTab';
import { RequestNewLoanForm } from './components/RequestNewLoanForm';
import '../../BookDetails.scss';

export default class BookMetadata extends Component {
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  _render_book_info() {
    console.log(this.props);
    const bookData = this.props.bookDetails;
    return (
      <div className="book-info">
        <Header as="h2">{bookData.title}</Header>
        <List>
          {bookData.authors.map((author, index) => (
            <List.Item as="h4" key={`Key${index}`}>
              Author: {author}
            </List.Item>
          ))}
        </List>
        <List>
          {bookData.publishers.map((publisher, index) => (
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
        <Responsive minWidth={this.props.displayWidth}>
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
    return this.props.bookDetails.files ? (
      <div>
        <Header as="h3">Files</Header>
        <List>
          {this.props.bookDetails.files.map((file, index) => (
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
    this.props.bookDetails.booklinks = null;
    return this.props.bookDetails.booklinks ? (
      <div>
        <Header as="h3">Links</Header>
        <List>
          {this.props.bookDetails.booklinks.map((link, index) => (
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

  _render_share_buttons() {
    return (
      <Responsive maxWidth={this.props.displayWidth}>
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
    const bookData = this.props.bookDetails;
    const { visible } = this.state;
    return (
      <div className="loan-request">
        <Button primary disabled size="large" color="blue">
          Open eBook
        </Button>

        <Responsive maxWidth={this.props.displayWidth}>
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

        <RequestNewLoanForm docPid={bookData.document_pid} visible={visible} />
      </div>
    );
  }

  _render_circulation_buttons() {
    const circulation_data = this.props.bookDetails.circulation;
    const button_color = circulation_data.loanable_items > 0 ? 'green' : 'red';
    return (
      <div>
        <Button
          color={button_color}
          content="Available copies"
          label={{
            basic: true,
            color: button_color,
            pointing: 'left',
            content: circulation_data.loanable_items,
          }}
        />

        <Responsive maxWidth={this.props.displayWidth}>
          <div className="ui hidden divider" />
        </Responsive>

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

        <Responsive maxWidth={this.props.displayWidth}>
          <div className="ui hidden divider" />
        </Responsive>

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
      </div>
    );
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    const bookData = this.props.bookDetails;
    return (
      <Segment className="book-metadata">
        <Grid>
          <Grid.Row>
            <Grid stackable columns={2}>
              <Grid.Column width={3}>
                <Image src={cover} size="medium" />
                {this._render_share_buttons()}
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
            <Responsive as={Container} minWidth={this.props.displayWidth}>
              <Grid columns={2}>
                {this._render_attachments()}
                <BookTab
                  data={bookData}
                  displayWidth={this.props.displayWidth}
                />
              </Grid>
            </Responsive>

            <Responsive as={Container} maxWidth={this.props.displayWidth}>
              <BookTab data={bookData} displayWidth={this.props.displayWidth} />
              {this._render_attachments()}
            </Responsive>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

BookMetadata.propTypes = {
  bookDetails: PropTypes.object.isRequired,
};

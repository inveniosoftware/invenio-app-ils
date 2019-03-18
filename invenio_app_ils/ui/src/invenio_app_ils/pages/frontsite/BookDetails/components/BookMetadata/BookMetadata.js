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
import { invenioConfig } from '../../../../../common/config';
import BookTab from '../BookTab';
import { RequestNewLoanForm } from './components/RequestNewLoanForm';
import '../../BookDetails.scss';

export default class BookMetadata extends Component {
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  _render_book_info() {
    const bookData = this.props.bookDetails;
    return (
      <div className="book-info">
        <Header as="h2">{bookData.title}</Header>
        <List>
          {bookData.authors.map(author => (
            <List.Item as="h4">Author: {author}</List.Item>
          ))}
        </List>
        <List>
          {bookData.publishers.map(publisher => (
            <List.Item as="h5">Publisher: {publisher}</List.Item>
          ))}
        </List>
      </div>
    );
  }

  _render_share_buttons_large() {
    return (
      <div>
        <Responsive minWidth={768}>
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
    const files = this.props.bookDetails.files;
    return (
      <div>
        <Header as="h3">Files</Header>
        <List>
          {files.map(file => (
            <List.Item href={file}>{file}</List.Item>
          ))}
        </List>
      </div>
    );
  }

  _render_links() {
    const booklinks = this.props.bookDetails.booklinks;
    return (
      <div>
        <Header as="h3">Links</Header>
        <List>
          {booklinks.map(link => (
            <List.Item href={link}>{link}</List.Item>
          ))}
        </List>
      </div>
    );
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

        <Grid.Row>
          {this._render_files()}
          <div className="ui divider" />
        </Grid.Row>

        <Grid.Row>{this._render_links()}</Grid.Row>
      </Grid.Column>
    );
  }

  _render_share_buttons() {
    return (
      <Responsive maxWidth={768}>
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
        <Button disabled class="fluid ui button" size="large" color="blue">
          Open eBook
        </Button>

        <Responsive maxWidth={768}>
          <div className="ui hidden divider" />
        </Responsive>

        <Button
          class="fluid ui button"
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
            color: 'green',
            pointing: 'left',
            content: circulation_data.loanable_items,
          }}
        />

        <Responsive maxWidth={768}>
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

        <Responsive maxWidth={768}>
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
            <Responsive as={Container} minWidth={768}>
              <Grid columns={2}>
                {this._render_attachments()}
                <BookTab data={bookData} />
              </Grid>
            </Responsive>

            <Responsive as={Container} maxWidth={768}>
              <BookTab data={bookData} />
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

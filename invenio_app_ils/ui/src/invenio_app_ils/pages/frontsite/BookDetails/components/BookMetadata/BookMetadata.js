import React, { Component } from 'react';
import { Grid, Segment, Image, Responsive, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { invenioConfig } from '../../../../../common/config';
import BookButtons from '../BookButtons';
import BookTab from '../BookTab';
import BookInfo from '../BookInfo';
import BookAttachments from '../BookAttachments';

export default class BookMetadata extends Component {
  openEditor(url) {
    window.open(`${invenioConfig.editor.url}?url=${url}`, url);
  }

  render() {
    const cover =
      'https://images-na.ssl-images-amazon.com/images/I/51i9XBsoD5L._SL160_.jpg';
    return (
      <Segment className="book-metadata">
        <Grid divided="horizontally">
          <Grid.Row>
            <Grid stackable columns={2}>
              <Grid.Column width={3}>
                <Image src={cover} size="medium" />
              </Grid.Column>

              <Grid.Column width={13}>
                <Grid.Row>
                  <div className="ui hidden divider" />
                  <BookInfo data={this.props.bookDetails} />
                  <div className="ui hidden divider" />
                </Grid.Row>

                <Grid.Row>
                  <div className="ui hidden divider" />
                  <BookButtons />
                  <div className="ui hidden divider" />
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>

          <Grid.Row>
            <Responsive
              as={Container}
              minWidth={768}
              data={this.props.bookDetails}
            >
              <Grid columns={2}>
                <BookAttachments data={this.props.bookDetails} />
                <BookTab data={this.props.bookDetails} />
              </Grid>
            </Responsive>

            <Responsive
              as={Container}
              maxWidth={768}
              data={this.props.bookDetails}
            >
              <BookTab data={this.props.bookDetails} />
              <BookAttachments data={this.props.bookDetails} />
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

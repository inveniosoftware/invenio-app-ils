import React, { Component } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

export default class BookItem extends Component {
  _render_share_buttons() {
    return (
      <div>
        <Button
          href="https://www.facebook.com/sharer/sharer.php"
          circular
          color="facebook"
          icon="facebook"
          size="mini"
        />
        <Button
          href="https://twitter.com/intent/tweet"
          circular
          color="twitter"
          icon="twitter"
          size="mini"
        />
        <Button circular color="linkedin" icon="linkedin" size="mini" />
      </div>
    );
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    const bookData = this.props.data;
    const maxAbstractLength = 300;
    const ending = '...';
    return (
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={cover} size="small" />
            <Item.Content>
              <Item.Header>{bookData.Title}</Item.Header>
              <Item.Meta>
                <span className="author">Author: {bookData.Authors}</span>
              </Item.Meta>
              <Item.Meta>
                <span className="edition">
                  Publisher: {bookData.Publishers}
                </span>
              </Item.Meta>
              <Item.Description>
                {bookData.Abstracts.substring(0, maxAbstractLength) + ending}
              </Item.Description>
              <Item.Extra>
                <Button disabled primary size="small" color="blue">
                  Open eBook
                </Button>
                <Button
                  primary
                  size="small"
                  color="blue"
                  onClick={() => {
                    this.props.rowActionClickHandler(bookData.ID);
                  }}
                >
                  Loan Book
                </Button>
                <Button
                  circular
                  onClick={() => {
                    this.props.rowActionClickHandler(bookData.ID);
                  }}
                >
                  View Details
                </Button>
              </Item.Extra>
              <Item.Extra>
                <Label>Non-Fiction</Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
        {this._render_share_buttons()}
      </Segment>
    );
  }
}

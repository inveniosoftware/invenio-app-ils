import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Popup } from 'semantic-ui-react';

import BookCover from '../../../BookCover';

import './BookItem.scss';

class BookItem extends Component {
  constructor(props) {
    super(props);

    this.cover = {
      width: 180,
      height: 260,
    };

    this.goToDetails = this.goToDetails.bind(this);
  }

  goToDetails() {
    this.props.history.push({
      pathname: `/record/${this.props.recid}`,
      state: {
        recid: this.props.recid,
      },
    });
  }

  renderBookAuthors(data) {
    if (data.authors) {
      return data.authors.map(author => author.full_name).join();
    } else if (data.corporate_authors) {
      return data.corporate_authors.join();
    } else {
      return 'No authors available';
    }
  }

  render() {
    const { title, coverUrl, authors } = this.props;
    return (
      <div className="book-item">
        <BookCover {...this.cover} coverUrl={coverUrl} />
        <div
          className="book-overlay"
          style={{
            width: `${this.cover.width}px`,
            height: `${this.cover.height}px`,
          }}
        >
          <Icon name="bookmark" size="large" />
          <Button circular icon="eye" size="big" onClick={this.goToDetails} />
          <Icon name="plus circle" size="large" />
        </div>
        <div className="book-meta">
          <Popup
            trigger={<span className="book-title truncate">{title}</span>}
            content={title}
          />
          <Popup
            trigger={
              <span className="book-author truncate">
                {authors.join(' | ')}
              </span>
            }
            content={authors.join(' | ')}
            position="bottom left"
          />
        </div>
      </div>
    );
  }
}

export default withRouter(BookItem);

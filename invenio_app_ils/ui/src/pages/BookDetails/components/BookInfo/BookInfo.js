import React, { Component } from 'react';
import BookTabs from '../BookTabs';

import './BookInfo.css';
import { Loader } from 'semantic-ui-react';

class BookInfo extends Component {
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
    let { data, isLoading } = this.props;
    if (isLoading) return <Loader active inline="centered" />;
    return (
      <div className="book-details-info">
        <div className="book-details-title">
          <h1>{data.titles[0].title}</h1>
        </div>
        <div className="book-details-author">
          by {this.renderBookAuthors(data)}
        </div>
        <div className="book-details-abstract">{data.abstracts[0]}</div>
        <div className="book-details-other">Aditional Information</div>
        <BookTabs />
      </div>
    );
  }
}

export default BookInfo;

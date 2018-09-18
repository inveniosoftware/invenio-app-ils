import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

import './BookCover.css';

class BookCover extends Component {
  render() {
    const { width, height, coverUrl } = this.props;

    return (
      <div
        className="book-cover"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url(${coverUrl})`,
        }}
      >
        {/* <Loader active inline="centered" /> */}
      </div>
    );
  }
}

export default BookCover;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BookItem from './components/BookItem';

import './BookList.css';

export default class BookList extends Component {
  renderBook(book) {
    return (
      <BookItem
        key={book.id}
        recid={book.recid}
        coverUrl={book.coverUrl}
        title={book.title}
        authors={book.authors || book.corporate_authors}
        description={book.description}
      />
    );
  }

  render() {
    const { items, title } = this.props.data;
    return (
      <div className="book-list">
        <div className="book-list-header">{title}</div>

        <div className="book-list-content">{items.map(this.renderBook)}</div>
      </div>
    );
  }
}

BookList.propTypes = {
  title: PropTypes.string,
  bookList: PropTypes.object,
};

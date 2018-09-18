import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Loader } from 'semantic-ui-react';
import BookList from '../../../../components/BookList';

export default class BookResults extends Component {
  componentDidMount() {
    this.props.fetchBookResults();
  }

  renderBookList(listItem, index) {
    return <BookList data={listItem} key={index} />;
  }

  render() {
    let { data, isLoading } = this.props;
    if (isLoading) return <Loader active inline="centered" />;
    return (
      <List className="book-results">{data.map(this.renderBookList)}</List>
    );
  }
}

BookResults.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          title: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    })
  ),
  divided: PropTypes.bool,
};

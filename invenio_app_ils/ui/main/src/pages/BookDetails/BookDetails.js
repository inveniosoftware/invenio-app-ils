import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import BookList from '../../components/BookList';
import BookCover from '../../components/BookCover';
import BookInfo from './components/BookInfo';
import BookLoan from './components/BookLoan';

import './BookDetails.scss';
import { Loader } from 'semantic-ui-react';

class BookDetails extends Component {
  constructor(props) {
    super(props);

    this.cover = {
      width: 300,
      height: 420,
    };

    this.state = {
      bookInfo: {},
      coverUrl: '',
    };

    this.fetchBookDetails = this.props.fetchBookDetails.bind(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.recid) {
        this.fetchBookDetails(location.state.recid);
      }
    });

    this.fetchBookDetails(this.props.match.params.recid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let { data, isLoading } = this.props;
    if (isLoading) return <Loader active inline="centered" />;
    return (
      <div className="book-details-container">
        <div className="book-details">
          <div className="book-meta">
            <BookCover {...this.cover} coverUrl={data.coverUrl} />
            <BookInfo data={data} />
          </div>
          <BookLoan />
        </div>

        <BookList data={data.related} />
      </div>
    );
  }
}

export default withRouter(BookDetails);

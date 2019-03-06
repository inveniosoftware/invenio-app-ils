import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { BookDetails } from './components';

export default class BookDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchBookDetails = this.props.fetchBookDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentPid) {
        this.fetchBookDetails(location.state.documentPid);
      }
    });
    this.fetchBookDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <BookDetails />
      </Container>
    );
  }
}

BookDetailsContainer.propTypes = {
  fetchBookDetails: PropTypes.func.isRequired,
};

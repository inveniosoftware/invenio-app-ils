import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoanList from './components/LoanList/LoanList';

export default class LoanListContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanList = this.props.fetchLoanList;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state) {
        this.fetchLoanList();
      }
    });
    this.fetchLoanList();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return <LoanList {...this.props} />;
  }
}

LoanListContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

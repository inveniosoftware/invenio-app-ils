import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Loader, Container, Message } from 'semantic-ui-react';
import LoanTable from './LoanTable/LoanTable';

class LoanList extends Component {
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
    let { data, error, isLoading } = this.props;
    if (error) {
      return (
        <Message
          icon="exclamation"
          header="Oups, something went horribly wrong!"
          content={error.message}
        />
      );
    }
    if (isLoading) return <Loader active inline="centered" />;
    return (
      <Container>
        <h2>Loan list</h2>
        <LoanTable data={data} />
      </Container>
    );
  }
}

export default withRouter(LoanList);

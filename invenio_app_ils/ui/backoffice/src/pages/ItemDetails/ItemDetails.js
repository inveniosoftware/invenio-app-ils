import React, { Component } from 'react';
import { Loader, Message } from 'semantic-ui-react';
import { ItemTitle } from './components/ItemTitle/ItemTitle';
import { ItemMetadata } from './components/ItemMetadata/ItemMetadata';
import { ItemLoans } from './components/ItemLoans/ItemLoans';
import { ItemLoanRequests } from './components/ItemLoanRequests/ItemLoanRequests';
import { ItemLoanHistory } from './components/ItemLoanHistory/ItemLoanHistory';

export default class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchItemDetails = this.props.fetchItemDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.itemId) {
        this.fetchItemDetails(location.state.itemId);
      }
    });
    this.fetchItemDetails(this.props.match.params.itemId);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let { data, error, fetchLoading } = this.props;
    if (error) {
      console.error(error);
      return (
        <Message
          icon="exclamation"
          header="Oups, something went horribly wrong!"
          content={error.message}
        />
      );
    }
    if (fetchLoading) return <Loader active inline="centered" />;
    return (
      <section>
        <ItemTitle data={data} />
        <ItemMetadata data={data} />
        <ItemLoans />
        <ItemLoanRequests />
        <ItemLoanHistory />
      </section>
    );
  }
}

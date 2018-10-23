import React, { Component } from 'react';
import { Loader, Container, Message } from 'semantic-ui-react';
import { ItemTitle } from './components/ItemTitle/ItemTitle';
import { ItemMetadata } from './components/ItemMetadata/ItemMetadata';
import { ItemHoldings } from './components/ItemHoldings/ItemHoldings';
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
      <Container>
        <ItemTitle data={data} />
        <ItemMetadata data={data} />
        <ItemHoldings />
        <ItemLoanRequests />
        <ItemLoanHistory />
      </Container>
    );
  }
}

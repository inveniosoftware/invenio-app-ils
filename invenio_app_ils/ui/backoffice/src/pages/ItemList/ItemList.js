import React, { Component } from 'react';
import { Loader, Container, Message } from 'semantic-ui-react';

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.fetchItemList = this.props.fetchItemList;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state) {
        this.fetchItemList();
      }
    });
    this.fetchItemList();
  }

  componentWillUnmount() {
    this.unlisten();
  }
  render() {
    let { data, error, isLoading } = this.props;
    console.log(data);
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
        <h1>This is the item list</h1>
      </Container>
    );
  }
}

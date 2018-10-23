import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Loader, Container, Message } from 'semantic-ui-react';
import ItemTable from './ItemTable/ItemTable';

class ItemList extends Component {
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
        <h2>Item list</h2>
        <ItemTable data={data} />
      </Container>
    );
  }
}

export default withRouter(ItemList);

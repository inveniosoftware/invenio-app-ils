import React, { Component } from 'react';
import { Loader, Grid, Message } from 'semantic-ui-react';
import { ItemMetadata } from './components/ItemMetadata';

export default class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchItemDetails = this.props.fetchItemDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.recid) {
        this.fetchItemDetails(location.state.recid);
      }
    });
    this.fetchItemDetails(this.props.match.params.recid);
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
      <Grid centered>
        <Grid.Row>
          <ItemMetadata data={data} />
        </Grid.Row>
      </Grid>
    );
  }
}

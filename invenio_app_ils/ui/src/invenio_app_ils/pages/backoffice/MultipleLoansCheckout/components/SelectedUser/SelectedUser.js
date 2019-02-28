import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { Grid, Segment, List, Header } from 'semantic-ui-react';

export default class SelectedUser extends Component {
  constructor(props) {
    super(props);
    this.fetchUserDetails = this.props.fetchUserDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.userPid) {
        this.fetchUserDetails(location.state.userPid);
      }
    });
    this.fetchUserDetails(this.props.match.params.userPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, hasError, data } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <Segment className="user-metadata">
            <Grid padded columns={2}>
              <Grid.Column width={10}>
                <Header as="h2">Patron - {data.user_pid}</Header>
              </Grid.Column>
              <Grid.Column>
                <List relaxed size="large">
                  <List.Item>
                    <List.Header>Email</List.Header>
                    {data.email}
                  </List.Item>
                  <List.Item />
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </Error>
      </Loader>
    );
  }
}

SelectedUser.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
  fetchUserDetails: PropTypes.func.isRequired,
};

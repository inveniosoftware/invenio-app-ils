import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { UserDetails } from './components';

export default class UserDetailsContainer extends Component {
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
    return (
      <Container>
        <UserDetails />
      </Container>
    );
  }
}

UserDetailsContainer.propTypes = {
  fetchUserDetails: PropTypes.func.isRequired,
};

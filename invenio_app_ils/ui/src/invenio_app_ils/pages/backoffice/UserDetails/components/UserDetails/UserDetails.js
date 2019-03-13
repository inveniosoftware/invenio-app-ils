import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { UserMetadata, PatronPendingLoans } from '../';
import { Grid } from 'semantic-ui-react';
import { PatronCurrentLoans } from '../PatronCurrentLoans';
import { ItemsCheckout } from '../ItemsCheckout';
import { ItemsSearch } from '../ItemsSearch';

export default class UserDetails extends Component {
  render() {
    const { isLoading, error, data } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Grid columns={2}>
            <Grid.Row stretched>
              <Grid.Column width={6}>
                <UserMetadata />
              </Grid.Column>
              <Grid.Column width={10}>
                <PatronPendingLoans patron={data.user_pid} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column width={16}>
                <ItemsCheckout patron={data.user_pid} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched columns={2}>
              <Grid.Column width={8}>
                <ItemsSearch patron={data.user_pid} />
              </Grid.Column>
              <Grid.Column width={8}>
                <PatronCurrentLoans patron={data.user_pid} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Error>
      </Loader>
    );
  }
}

UserDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  error: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};

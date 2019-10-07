import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { PatronMetadata, PatronPendingLoans } from '../';
import { Grid } from 'semantic-ui-react';
import { PatronCurrentLoans } from '../PatronCurrentLoans';
import { ItemsCheckout } from '../ItemsCheckout';
import { ItemsSearch } from '../ItemsSearch';
import { PatronDocumentRequests } from '../PatronDocumentRequests';

export default class PatronDetails extends Component {
  render() {
    const { isLoading, error, data } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <PatronMetadata />
                <ItemsCheckout patron={data.user_pid} />
                <ItemsSearch patronPid={data.user_pid} />
              </Grid.Column>

              <Grid.Column>
                <PatronCurrentLoans patronPid={data.user_pid} />
                <PatronPendingLoans patronPid={data.user_pid} />
                <PatronDocumentRequests patronPid={data.user_pid} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Error>
      </Loader>
    );
  }
}

PatronDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  error: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};

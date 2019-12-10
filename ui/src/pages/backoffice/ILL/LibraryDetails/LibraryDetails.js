import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import history from '@history';
import { Loader, Error } from '@components';
import { LibraryMetadata } from './components';

export default class LibraryDetails extends Component {
  constructor(props) {
    super(props);
    this.deleteLibrary = this.props.deleteLibrary;
    this.fetchLibraryDetails = this.props.fetchLibraryDetails;
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Library') {
        this.fetchLibraryDetails(loc.state.pid);
      }
    });
    this.fetchLibraryDetails(this.props.match.params.libraryPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <LibraryMetadata />
          </Error>
        </Loader>
      </Container>
    );
  }
}

LibraryDetails.propTypes = {
  deleteLibrary: PropTypes.func.isRequired,
  fetchLibraryDetails: PropTypes.func.isRequired,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { LibraryMetadata } from './components';

export default class LibraryDetails extends Component {
  constructor(props) {
    super(props);
    this.deleteLibrary = this.props.deleteLibrary;
    this.fetchLibraryDetails = this.props.fetchLibraryDetails;
  }

  componentDidMount() {
    this.props.fetchLibraryDetails(this.props.match.params.libraryPid);
  }

  componentDidUpdate(prevProps) {
    const libraryPid = this.props.match.params.libraryPid;
    const samePidFromRouter = prevProps.match.params.libraryPid === libraryPid;
    if (!samePidFromRouter) {
      this.props.fetchLibraryDetails(libraryPid);
    }
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

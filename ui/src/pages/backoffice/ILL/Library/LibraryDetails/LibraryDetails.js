import { illBorrowingRequest as brwReqApi } from '@api';
import { CopyButton, Error, Loader } from '@components';
import {
  DeleteRecordModal,
  DetailsHeader,
  EditButton,
} from '@pages/backoffice/components';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { ILLLibraryIcon } from '@pages/backoffice/components/icons';
import { ILLRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Container,
  Divider,
  Grid,
  Icon,
  Ref,
  Sticky,
} from 'semantic-ui-react';
import { LibraryInformation } from './LibraryInformation';
import { goTo } from '@history';

const DeleteLibraryButton = props => {
  return (
    <DeleteButton
      fluid
      content="Delete library"
      labelPosition="left"
      {...props}
    />
  );
};

class ActionMenu extends React.Component {
  createRefProps(libraryPid) {
    const brwReqRefProps = {
      refType: 'Borrowing Requests',
      onRefClick: brwReqPid =>
        goTo(ILLRoutes.borrowinRequestDetailsFor(brwReqPid)),
      getRefData: () =>
        brwReqApi.list(
          brwReqApi
            .query()
            .withLibraryPid(libraryPid)
            .qs()
        ),
    };

    return [brwReqRefProps];
  }

  render() {
    const library = this.props.data.metadata;

    return (
      <div className={'bo-action-menu'}>
        <Sticky context={this.contextRef}>
          <EditButton fluid to={ILLRoutes.libraryEditFor(library.pid)} />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Library record
              with ID ${library.pid}?`}
            refProps={this.createRefProps(library.pid)}
            onDelete={() => this.props.deleteLibraryHandler(library.pid)}
            trigger={DeleteLibraryButton}
          />

          <Divider horizontal>Navigation</Divider>

          <Link
            to={ILLRoutes.borrowingRequestListWithQuery(
              brwReqApi
                .query()
                .withLibraryPid(library.pid)
                .qs()
            )}
          >
            <Icon name={'search'} />
            See borrowing requests from {library.name}
          </Link>
        </Sticky>
      </div>
    );
  }
}

class LibraryHeader extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <DetailsHeader
        title={data.metadata.name}
        pid={data.metadata.pid}
        icon={<ILLLibraryIcon />}
        recordType="Library"
      >
        <label>Library</label> #{data.metadata.pid}
        <CopyButton text={data.metadata.pid} />
      </DetailsHeader>
    );
  }
}

class LibraryDetailsInner extends React.Component {
  constructor(props) {
    super(props);
    this.contextRef = React.createRef();
  }

  render() {
    const { data } = this.props;
    const panels = [
      {
        key: 'library-info',
        title: 'Library information',
        content: (
          <Accordion.Content>
            <div ref={this.libraryInfoRef}>
              <LibraryInformation library={data.metadata} />
            </div>
          </Accordion.Content>
        ),
      },
    ];

    return (
      <Accordion
        fluid
        styled
        className="highlighted"
        panels={panels}
        exclusive={false}
        defaultActiveIndex={[0]}
      />
    );
  }
}

export default class LibraryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
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
    const { data, isLoading, error } = this.props;

    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <LibraryHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container className="spaced">
                        <LibraryDetailsInner data={data} />
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu
                          data={data}
                          deleteLibraryHandler={this.props.deleteLibrary}
                        />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

LibraryDetails.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  fetchLibraryDetails: PropTypes.func.isRequired,
  deleteLibrary: PropTypes.func.isRequired,
};

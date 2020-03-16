import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _startCase from 'lodash/startCase';
import { Loader, Error, ResultsTable, Pagination } from '@components';
import { dateFormatter } from '@api/date';
import { FrontSiteRoutes } from '@routes/urls';
import { Button, Header, Item } from 'semantic-ui-react';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { NoResultsMessage } from '../../components/NoResultsMessage';
import { invenioConfig, ES_DELAY } from '@config';
import { PatronCancelModal } from '../components';
import _get from 'lodash/get';
import _has from 'lodash/has';

export default class PatronCurrentDocumentRequests extends Component {
  state = {
    activePage: 1,
    cancelModal: { isOpen: false, btnClasses: undefined, data: undefined },
  };

  constructor(props) {
    super(props);
    this.fetchPatronDocumentRequests = this.props.fetchPatronDocumentRequests;
    this.patronPid = this.props.patronPid;
  }

  componentDidMount() {
    this.fetchPatronDocumentRequests(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronDocumentRequests(this.patronPid, activePage);
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        loading={this.props.isLoading}
        totalResults={this.props.data.total}
        onPageChange={this.onPageChange}
      />
    );
  };

  libraryBookFormatter = ({ row }) => {
    if (row.metadata.state !== 'ACCEPTED') {
      return _startCase(row.metadata.state.toLowerCase());
    }
    return (
      <Link to={FrontSiteRoutes.documentDetailsFor(row.metadata.document_pid)}>
        {row.metadata.document.title}
      </Link>
    );
  };

  renderLoader = props => {
    return (
      <Item.Group>
        <ILSItemPlaceholder fluid {...props} />
      </Item.Group>
    );
  };

  renderNoResults = () => {
    return (
      <NoResultsMessage
        messageHeader={'Requests for new literature'}
        messageContent={
          'You did not create any request for literature, ' +
          'that is not available at the library.'
        }
      />
    );
  };

  renderCancelButton = ({ row }) => {
    return (
      <Button
        size="small"
        onClick={e =>
          this.setState({
            cancelModal: {
              isOpen: true,
              btnClasses: e.target.classList,
              data: row,
            },
          })
        }
      >
        cancel
      </Button>
    );
  };

  getColumns = () => [
    { title: 'Title', field: 'metadata.title' },
    {
      title: 'Request state',
      field: 'metadata.state',
      formatter: this.libraryBookFormatter,
    },
    { title: 'Created', field: 'created', formatter: dateFormatter },
    { title: 'Authors', field: 'metadata.authors' },
    { title: 'Publication year', field: 'metadata.publication_year' },
    {
      title: 'Actions',
      field: '',
      formatter: this.renderCancelButton,
    },
  ];

  onCancelRequestClick = () => {
    const row = this.state.cancelModal.data;
    this.onCloseCancelModal();
    this.state.cancelModal.btnClasses.add('disabled');
    this.state.cancelModal.btnClasses.add('loading');
    this.props.rejectRequest(row.id, {
      reject_reason: invenioConfig.documentRequests.rejectTypes.userCancel,
    });
    setTimeout(() => {
      this.fetchPatronDocumentRequests(this.props.patronPid).then(res => {
        if (!_has(this.state, 'cancelModal.btnClasses.remove')) return;
        this.state.cancelModal.btnClasses.remove('disabled');
        this.state.cancelModal.btnClasses.remove('loading');
      });
    }, ES_DELAY);
  };

  onCloseCancelModal = () => {
    this.setState({ cancelModal: { isOpen: false, data: undefined } });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const columns = this.getColumns();
    return (
      <>
        <Header
          as={'h2'}
          content={'Your literature requests'}
          className={'highlight'}
          textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>
            <ResultsTable
              unstackable
              data={data.hits}
              columns={columns}
              totalHitsCount={data.total}
              title={''}
              name={'book requests'}
              paginationComponent={this.paginationComponent()}
              currentPage={this.state.activePage}
              renderEmptyResultsElement={this.renderNoResults}
            />
            <PatronCancelModal
              open={this.state.cancelModal.isOpen}
              headerContent={'Are you sure you want to cancel your request?'}
              documentTitle={_get(this.state.cancelModal.data, 'metadata.title')}
              onCloseModal={this.onCloseCancelModal}
              onCancelAction={this.onCancelRequestClick}
            />
          </Error>
        </Loader>
      </>
    );
  }
}

PatronCurrentDocumentRequests.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronDocumentRequests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

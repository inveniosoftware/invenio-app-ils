import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, Pagination } from '@components';
import { Container, Header, Item } from 'semantic-ui-react';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { NoResultsMessage } from '../../components/NoResultsMessage';
import { ES_DELAY } from '@config';
import { LoanRequestListEntry } from './components/LoanRequestListEntry';
import { PatronCancelModal } from '../components';
import isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _has from 'lodash/has';

const PAGE_SIZE = 5;

export default class PatronPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPendingLoans = this.props.fetchPatronPendingLoans;
    this.performLoanAction = this.props.performLoanAction;
    this.patronPid = this.props.patronPid;
    this.state = {
      activePage: 1,
      cancelModal: { isOpen: false, btnClasses: undefined, data: undefined },
    };
  }

  componentDidMount() {
    this.fetchPatronPendingLoans(this.patronPid, {
      page: this.state.activePage,
      size: PAGE_SIZE,
    });
  }

  onPageChange = activePage => {
    this.fetchPatronPendingLoans(this.patronPid, {
      page: activePage,
      size: PAGE_SIZE,
    });
    this.setState({ activePage: activePage });
  };

  renderList(data) {
    if (!isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>
            {data.hits.map(entry => (
              <LoanRequestListEntry
                key={entry.metadata.pid}
                loan={entry}
                onCancelButton={this.onShowCancelModal}
              />
            ))}
          </Item.Group>
          <Container textAlign={'center'}>
            <Pagination
              currentPage={this.state.activePage}
              currentSize={PAGE_SIZE}
              loading={this.props.isLoading}
              onPageChange={this.onPageChange}
              totalResults={this.props.data.total}
            />
          </Container>
        </>
      );
    }
    return (
      <NoResultsMessage
        messageHeader={'No loan requests'}
        messageContent={'You do not currently have any loan request.'}
      />
    );
  }

  renderLoader = props => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props} />
          <ILSItemPlaceholder fluid {...props} />
        </Item.Group>
      </>
    );
  };

  onShowCancelModal = (e, loan) => {
    this.setState({
      cancelModal: { isOpen: true, btnClasses: e.target.classList, data: loan },
    });
  };

  onCloseCancelModal = () => {
    this.setState({
      cancelModal: { isOpen: false, data: undefined },
    });
  };

  onCancelRequestClick = () => {
    const loan = this.state.cancelModal.data;
    const { btnClasses } = this.state.cancelModal;
    btnClasses.add('disabled');
    btnClasses.add('loading');
    this.onCloseCancelModal();
    this.performLoanAction(
      _get(loan, 'availableActions.cancel'),
      _get(loan, 'metadata.document_pid'),
      this.patronPid,
      {
        item_pid: _get(loan, 'metadata.item_pid'),
        cancelReason: 'USER_CANCEL',
      }
    );
    setTimeout(() => {
      this.fetchPatronPendingLoans(
        this.patronPid,
        this.state.activePage,
        PAGE_SIZE
      ).then(res => {
        if (!_has(this.state, 'cancelModal.btnClasses.remove')) return;
        btnClasses.remove('disabled');
        btnClasses.remove('loading');
      });
    }, ES_DELAY);
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container className="spaced">
        <Header
          as={'h2'}
          content={'Your loan requests'}
          className={'highlight'}
          textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>
            {this.renderList(data)}
            <PatronCancelModal
              data={this.state.cancelModal.data}
              open={this.state.cancelModal.isOpen}
              headerContent={
                'Are you sure you want to cancel your loan request?'
              }
              documentTitle={_get(
                this.state.cancelModal.data,
                'metadata.document.title'
              )}
              onCloseModal={this.onCloseCancelModal}
              onCancelAction={this.onCancelRequestClick}
            />
          </Error>
        </Loader>
      </Container>
    );
  }
}

PatronPendingLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

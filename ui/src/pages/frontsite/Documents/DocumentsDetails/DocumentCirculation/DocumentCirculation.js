import React, { Component } from 'react';
import { Divider, Header, List, Popup, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { LoginRedirectButton } from '@authentication/components';
import { LoanRequestForm } from '../LoanRequestForm';
import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';
import { ILSImagePlaceholder } from '@components/ILSPlaceholder';

class DocumentEItems extends Component {
  render() {
    const eitems = this.props.document.metadata.eitems.hits.map(eitem => {
      return (
        <List.Item key={eitem.pid}>
          <List.Icon name={'linkify'} />
          <List.Content>
            Read <a href="#TODO">online</a>
          </List.Content>
        </List.Item>
      );
    });
    if (eitems.length > 0) {
      return (
        <>
          <Header as="h3">Access online</Header>
          <List>{eitems}</List>
          <Divider horizontal>Or</Divider>
        </>
      );
    }
    return null;
  }
}

class BookAvailability extends Component {
  render() {
    const circulationData = this.props.document.metadata.circulation;
    if (circulationData.has_items_for_loan > 0) {
      return (
        <List.Item>
          <Popup
            content="Calculated based on current library stock"
            trigger={<List.Icon name={'info'} />}
          />
          <List.Content
            className={
              circulationData.has_items_for_loan > 0
                ? 'text-success'
                : 'text-danger'
            }
          >
            Available for loan <span className={'success'}>now</span>
          </List.Content>
        </List.Item>
      );
    } else if (circulationData.next_available_date) {
      return (
        <List.Item>
          <List.Icon name={'info'} />
          <List.Content>
            Available for loan from <b>{circulationData.next_available_date}</b>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item>
          <List.Icon name={'info'} />
          <List.Content>
            Long waiting queue. Contact us for more information.
          </List.Content>
        </List.Item>
      );
    }
  }
}

export default class DocumentCirculation extends Component {
  loginToLoan = () => {
    return <LoginRedirectButton content={'Login to loan'} />;
  };

  renderLoanRequestForm = () => {
    return <LoanRequestForm document={this.props.documentDetails} />;
  };

  renderEItems = () => {};

  render() {
    const { isLoading, documentDetails } = this.props;
    return (
      <Segment className={'highlighted'}>
        <ILSImagePlaceholder style={{ height: 400 }} isLoading={isLoading}>
          <DocumentEItems document={documentDetails} />
          <Header as="h3" content="Request loan" />
          <List>
            <BookAvailability document={documentDetails} />
          </List>
          <AuthenticationGuard
            authorizedComponent={this.renderLoanRequestForm}
            loginComponent={this.loginToLoan}
          />
        </ILSImagePlaceholder>
      </Segment>
    );
  }
}

DocumentCirculation.propTypes = {
  documentDetails: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

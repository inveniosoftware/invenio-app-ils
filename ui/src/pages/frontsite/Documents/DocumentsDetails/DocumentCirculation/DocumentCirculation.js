import React, { Component } from 'react';
import { Divider, Header, List, Segment, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { RedirectToLoginButton } from '@authentication/components';
import { LoanRequestForm } from '../LoanRequestForm';
import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';
import { ILSImagePlaceholder } from '@components/ILSPlaceholder';
import { eitem as eitemApi, file as fileApi } from '@api';
import { invenioConfig } from '@config';
import { DocumentLinks } from '@pages/frontsite/components/Document/DocumentLinks';

class DocumentEItems extends Component {
  prepareLinks(eitems) {
    const links = [];
    for (const eitem of eitems) {
      links.push(
        <List.Item key={eitem.pid}>
          <List.Icon name="linkify" />
          <List.Content>
            Read <a href="#TODO">online</a>
          </List.Content>
        </List.Item>
      );
      for (const file of eitem.files) {
        links.push(
          <List.Item key={file.file_id}>
            <List.Icon name="download" />
            <List.Content>
              Download{' '}
              <a
                href={fileApi.downloadURL(eitem.bucket_id, file.key)}
                onClick={() => eitemApi.fileDownloaded(eitem.pid, file.key)}
              >
                {file.key}
              </a>
            </List.Content>
          </List.Item>
        );
      }
    }
    return links;
  }

  showAll = () => {
    this.props.showTab(5);
    const element = document.getElementById('document-metadata-tabs');
    element.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const eitems = this.props.document.metadata.eitems;

    return eitems.total > 0 ? (
      <>
        <Header as="h3">Access online</Header>
        <DocumentLinks
          eitems={eitems}
          showMaxLinks={invenioConfig.documents.frontsiteMaxLinks}
          onShowAll={this.showAll}
        />
        <Divider horizontal>Or</Divider>
      </>
    ) : null;
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
    return <RedirectToLoginButton content={'Login to loan'} fluid positive />;
  };

  renderLoanRequestForm = () => {
    return <LoanRequestForm document={this.props.documentDetails} />;
  };

  renderEItems = () => {};

  render() {
    const { documentDetails, isLoading, loanRequestIsLoading } = this.props;
    return (
      <Segment
        loading={loanRequestIsLoading}
        className="highlighted fs-segment-transparent"
      >
        <ILSImagePlaceholder style={{ height: 400 }} isLoading={isLoading}>
          <DocumentEItems
            document={documentDetails}
            showTab={this.props.showTab}
          />
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

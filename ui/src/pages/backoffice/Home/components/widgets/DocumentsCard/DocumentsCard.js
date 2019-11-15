import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '@components';
import { RecordsBriefCard } from '@pages/backoffice/components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '@pages/backoffice/components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import { document as documentApi } from '@api';

class DataCard extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
    this.newDocumentURL = BackOfficeRoutes.documentCreate;
  }
  newDocumentButton = () => {
    return <NewButton fluid disabled to={this.newDocumentURL} />;
  };

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .withAvailableItems()
        .withPendingLoans()
        .qs()
    );
    return <SeeAllButton fluid disabled to={path} />;
  };

  render() {
    return (
      <RecordsBriefCard
        title={'Documents'}
        stats={this.data}
        text={'requested on shelf'}
        buttonLeft={this.newDocumentButton()}
        buttonRight={this.seeAllButton()}
      />
    );
  }
}

export default class DocumentsCard extends Component {
  constructor(props) {
    super(props);
    this.fetchRequestedWithAvailableItems =
      props.fetchRequestedWithAvailableItems;
  }

  componentDidMount() {
    this.fetchRequestedWithAvailableItems();
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DataCard data={data}/>
        </Error>
      </Loader>
    );
  }
}

DocumentsCard.propTypes = {
  fetchRequestedWithAvailableItems: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};

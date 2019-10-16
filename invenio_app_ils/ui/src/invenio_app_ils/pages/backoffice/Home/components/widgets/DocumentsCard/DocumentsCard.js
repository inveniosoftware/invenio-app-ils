import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { document as documentApi } from '../../../../../../common/api';

class DataCard extends Component {
  newDocumentButton = () => {
    return <NewButton fluid disabled url={BackOfficeRoutes.documentCreate} />;
  };

  seeAllButton = () => {
    const path = BackOfficeRoutes.documentsListWithQuery(
      documentApi
        .query()
        .withAvailableItems()
        .withPendingLoans()
        .qs()
    );
    return <SeeAllButton fluid disabled url={path} />;
  };

  render() {
    return (
      <RecordsBriefCard
        title={'Documents'}
        stats={this.props.data}
        text={'requested on shelf'}
        buttonLeft={this.newDocumentButton()}
        buttonRight={this.seeAllButton()}
      />
    );
  }
}

export default class DocumentsCard extends Component {
  componentDidMount() {
    this.props.fetchRequestedWithAvailableItems();
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DataCard data={data}></DataCard>
        </Error>
      </Loader>
    );
  }
}

DocumentsCard.propTypes = {
  fetchRequestedWithAvailableItems: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};

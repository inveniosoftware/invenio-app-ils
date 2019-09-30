import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { document as documentApi } from '../../../../../../common/api';
import { goToHandler } from '../../../../../../history';

class DataCard extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
    this.newDocumentURL = BackOfficeRoutes.documentCreate;
  }
  newDocumentButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={goToHandler(this.newDocumentURL)}
      />
    );
  };

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .withAvailableItems()
        .withPendingLoans()
        .qs()
    );
    return <SeeAllButton fluid disabled clickHandler={goToHandler(path)} />;
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

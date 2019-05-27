import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { document as documentApi } from '../../../../../../common/api';

export default class DocumentsCard extends Component {
  constructor(props) {
    super(props);
    this.fetchRequestedWithAvailableItems =
      props.fetchRequestedWithAvailableItems;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
    this.newDocumentURL = BackOfficeRoutes.documentsCreate;
  }

  componentDidMount() {
    this.fetchRequestedWithAvailableItems();
  }

  seeAllButton = () => {
    const handler = () =>
      this.props.history.push(
        this.seeAllUrl(
          documentApi
            .query()
            .withAvailableItems()
            .withPendingLoans()
            .qs()
        )
      );
    return <SeeAllButton fluid disabled clickHandler={() => handler()} />;
  };

  newDocumentButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={() => this.props.history.push(this.newDocumentURL)}
      />
    );
  };

  render_card = data => {
    return (
      <RecordsBriefCard
        title={'Documents'}
        stats={data}
        text={'requested on shelf'}
        buttonLeft={this.newDocumentButton()}
        buttonRight={this.seeAllButton()}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.render_card(data)}</Error>
      </Loader>
    );
  }
}

DocumentsCard.propTypes = {
  fetchRequestedWithAvailableItems: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};

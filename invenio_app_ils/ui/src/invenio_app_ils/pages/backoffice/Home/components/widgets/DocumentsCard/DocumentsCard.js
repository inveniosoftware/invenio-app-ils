import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import {
  BackOfficeURLS,
  documentsSearchQueryUrl,
} from '../../../../../../common/urls';
import { document as documentApi } from '../../../../../../common/api';

export default class DocumentsCard extends Component {
  constructor(props) {
    super(props);
    this.fetchRequestedWithAvailableItems =
      props.fetchRequestedWithAvailableItems;
    this.seeAllUrl = documentsSearchQueryUrl;
    this.newDocumentURL = BackOfficeURLS.newDocument;
  }

  componentDidMount() {
    this.fetchRequestedWithAvailableItems();
  }

  _seeAllButton = () => {
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

  _newDocumentButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={() => this.props.history.push(this.newDocumentURL)}
      />
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'Documents'}
        stats={data}
        text={'requested on shelf'}
        buttonLeft={this._newDocumentButton()}
        buttonRight={this._seeAllButton()}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._render_card(data)}</Error>
      </Loader>
    );
  }
}

DocumentsCard.propTypes = {
  fetchRequestedWithAvailableItems: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};

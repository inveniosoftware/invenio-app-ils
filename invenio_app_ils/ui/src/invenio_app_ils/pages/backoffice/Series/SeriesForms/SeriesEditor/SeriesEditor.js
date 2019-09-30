// EditUserDialog.js
import React, { Component } from 'react';
import { Loader, Error } from '../../../../../common/components';
import { SeriesForm } from './components';

export class SeriesEditor extends Component {
  componentDidMount() {
    if (this.props.match.params.seriesPid) {
      this.props.fetchSeriesDetails(this.props.match.params.seriesPid);
    }
  }

  renderEditForm = pid => {
    const { isLoading, error, data } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <SeriesForm
            pid={pid}
            data={data}
            title="Edit series"
            successSubmitMessage="Your series has been updated."
          />
        </Error>
      </Loader>
    );
  };

  render() {
    const {
      match: {
        params: { seriesPid },
      },
    } = this.props;
    const isEditForm = seriesPid ? true : false;
    return (
      <>
        {isEditForm ? (
          this.renderEditForm(seriesPid)
        ) : (
          <SeriesForm
            title="Create new series"
            successSubmitMessage="Your series has been created."
          />
        )}
      </>
    );
  }
}

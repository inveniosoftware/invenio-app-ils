import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { goToHandler } from '../../../history';
import { FrontSiteRoutes } from '../../../routes/urls';
import { document as documentApi } from '../../../common/api';

export class BookSeries extends Component {
  onClickSeries = (seriesPid, moi) =>
    goToHandler(
      FrontSiteRoutes.documentsListWithQuery(
        documentApi
          .query()
          .withSeriesPid(seriesPid, moi)
          .qs()
      )
    );

  render() {
    return (
      <div>
        {this.renderSeries(
          this.props.relations.serial,
          'Part of the series:',
          'SERIAL'
        )}
        <div className="ui hidden divider" />
        {this.renderSeries(
          this.props.relations.multipart_monograph,
          'Part of the multipart monograph:',
          'MULTIPART_MONOGRAPH'
        )}
      </div>
    );
  }

  renderSeries = (series, description, moi) => {
    return !isEmpty(series) ? (
      <div>
        <Header as="h4">{description}</Header>
        <List>
          {series.map((serie, index) => (
            <List.Item
              as="a"
              key={`Key${index}`}
              onClick={this.onClickSeries(serie.pid, moi)}
            >
              {serie.title}
            </List.Item>
          ))}
        </List>
      </div>
    ) : null;
  };
}

BookSeries.propTypes = {
  relations: PropTypes.object.isRequired,
};

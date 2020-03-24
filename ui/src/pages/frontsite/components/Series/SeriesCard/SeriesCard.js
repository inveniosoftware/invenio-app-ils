import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Label } from 'semantic-ui-react';
import { goTo } from '@history';
import { FrontSiteRoutes } from '@routes/urls';
import { SeriesImage, SeriesAuthors } from '@components/Series';
import _get from 'lodash/get';

export class SeriesCard extends Component {
  renderImage = () => {
    const { data, volume } = this.props;
    const image = <SeriesImage metadata={data.metadata} />;

    if (volume) {
      return (
        <div className="search-result-image">
          <Label floating color="black">
            Volume {volume}
          </Label>
          {image}
        </div>
      );
    }

    return image;
  };

  render() {
    const { data } = this.props;
    const serialsCount = _get(data, 'metadata.relations_metadata.serial', [])
      .length;
    const monographsCount = _get(
      data,
      'metadata.relations_metadata.multipart_monograph',
      []
    ).length;
    const documentsCount = serialsCount + monographsCount;
    return (
      <Card
        link
        centered
        className="fs-book-card"
        onClick={() =>
          goTo(FrontSiteRoutes.seriesDetailsFor(data.metadata.pid))
        }
        data-test={data.metadata.pid}
      >
        <Card.Meta className="discrete">Series</Card.Meta>
        {this.renderImage()}
        <Card.Content>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            <div>
              <SeriesAuthors metadata={data.metadata} />
            </div>
            {data.metadata.edition && (
              <div>Edition {data.metadata.edition}</div>
            )}
            {data.metadata.publisher && (
              <div>Publisher {data.metadata.publisher}</div>
            )}
            {documentsCount > 0 && <div>Volumes {documentsCount}</div>}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

SeriesCard.propTypes = {
  data: PropTypes.object.isRequired,
};

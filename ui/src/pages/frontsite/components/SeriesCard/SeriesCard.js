import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Label } from 'semantic-ui-react';
import get from 'lodash/get';
import { SeriesImage } from '@components/Series';

export class SeriesCard extends Component {
  render() {
    const { data } = this.props;
    const moi = data.metadata.mode_of_issuance;
    return (
      <Card link centered className="fs-book-card">
        <Card.Meta className={'discrete'}>{moi}</Card.Meta>
        <SeriesImage metadata={data.metadata} />
        <Card.Content>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            <div>{data.metadata.authors.join(', ')}</div>
            <div>Edition {data.metadata.edition}</div>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Label>
            {moi === 'SERIAL'
              ? `${get(data, 'metadata.relations.serial', []).length} issues`
              : `${
                  get(data, 'metadata.relations.multipart_monograph', []).length
                } volumes`}
          </Label>
        </Card.Content>
      </Card>
    );
  }
}

SeriesCard.propTypes = {
  data: PropTypes.object.isRequired,
};

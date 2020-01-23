import { getCover } from '@pages/frontsite/config';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react';
import { DocumentAuthors, DocumentEdition } from '@components/Document';
import isEmpty from 'lodash/isEmpty';

export class RelationCard extends Component {
  render() {
    const { data } = this.props;
    return (
      <Card centered className="bo-relation-card" data-test={data.metadata.pid}>
        <Card.Meta className={'discrete'}>
          {data.metadata.document_type || data.metadata.mode_of_issuance}
        </Card.Meta>
        {this.props.icon ? (
          this.props.icon
        ) : (
          <Image
            centered
            src={getCover(data.metadata.edition)}
            size="tiny"
            onError={e => (e.target.style.display = 'none')}
          />
        )}
        <Card.Content>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            <DocumentAuthors metadata={data.metadata} />
            <div>
              <DocumentEdition document={data} />
              {data.metadata.publication_year &&
                `(${data.metadata.publication_year})`}
            </div>
          </Card.Meta>
        </Card.Content>
        {!isEmpty(data.metadata.relations_metadata) &&
          !isEmpty(data.metadata.relations_metadata.multipart_monograph) && (
            <Card.Content extra>
              <Label>
                {data.metadata.relations_metadata.multipart_monograph.length}{' '}
                volumes
              </Label>
            </Card.Content>
          )}
      </Card>
    );
  }
}

RelationCard.propTypes = {
  data: PropTypes.object.isRequired,
  icon: PropTypes.node,
};

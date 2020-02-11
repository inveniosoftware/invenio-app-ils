import { SeriesAuthors } from '@components';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class SeriesCard extends Component {
  render() {
    const { data, extra, actions } = this.props;
    const linkTo = BackOfficeRoutes.seriesDetailsFor(data.metadata.pid);
    return (
      <Card centered className="bo-relation-card" data-test={data.metadata.pid}>
        <Card.Meta className={'discrete'}>
          {actions}
          {data.metadata.document_type || data.metadata.mode_of_issuance}
        </Card.Meta>
        <Icon name="clone outline" size="huge" color="grey" />
        <Card.Content>
          <Card.Header as={Link} to={linkTo} target="_blank">
            {data.metadata.title}
          </Card.Header>
          <Card.Meta>
            <SeriesAuthors metadata={data.metadata} />
            <div>
              {data.metadata.edition ? `ed.  ${data.metadata.edition}` : null}
              {data.metadata.publication_year &&
                `(${data.metadata.publication_year})`}
            </div>
          </Card.Meta>
        </Card.Content>
        {!isEmpty(extra) && <Card.Content extra>{extra}</Card.Content>}
      </Card>
    );
  }
}

SeriesCard.propTypes = {
  data: PropTypes.object.isRequired,
  icon: PropTypes.node,
  extra: PropTypes.node,
};

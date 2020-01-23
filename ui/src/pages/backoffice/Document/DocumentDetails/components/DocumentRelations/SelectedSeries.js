import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RelationCard } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/RelationCard/RelationCard';
import isEmpty from 'lodash/isEmpty';
import {
  Container,
  Divider,
  Grid,
  Icon,
  Label,
  Message,
} from 'semantic-ui-react';

export class SelectedSeries extends Component {
  render() {
    const { selection, currentDocument, volume } = this.props;
    return (
      <Container className="spaced">
        <Divider />
        <Grid columns={3} verticalAlign="middle">
          <Grid.Column width={6}>
            <RelationCard data={currentDocument} />
          </Grid.Column>
          <Grid.Column width={4}>
            <Icon name="arrow right" />
            <br />
            is{' '}
            <Label color="green">
              volume <Label.Detail>{volume}</Label.Detail>{' '}
            </Label>{' '}
            of
          </Grid.Column>
          <Grid.Column width={6}>
            {isEmpty(selection) ? (
              <Message
                fluid
                info
                icon="info circle"
                header="No multipart monograph selected"
                content="Select multipart monograph to proceed"
              />
            ) : (
              <RelationCard
                data={selection}
                icon={<Icon name="clone outline" size="huge" color="grey" />}
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

SelectedSeries.propTypes = {
  selection: PropTypes.object.isRequired,
  currentDocument: PropTypes.object.isRequired,
  volume: PropTypes.number.isRequired,
};

import { DocumentLanguages } from '@components/Document';
import { RemoveItemButton } from '@pages/backoffice/components/buttons';
import { RelationListEntry } from '../RelationListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RelationCard } from '../RelationCard';
import isEmpty from 'lodash/isEmpty';
import { Container, Grid, Icon, Label, Message, Item } from 'semantic-ui-react';

export class RelationSummary extends Component {
  render() {
    const {
      selections,
      currentReferer,
      renderSelections,
      emptySelectionMessageHeader,
      currentRefererComponent,
      relationDescription,
    } = this.props;

    return (
      <Container className="spaced">
        <Grid columns={3} verticalAlign="middle">
          <Grid.Column width={4}>
            {currentRefererComponent || (
              <RelationCard
                data={currentReferer}
                extra={
                  <>
                    <Icon size="big" name="language" />
                    <Label size="tiny" className="ml-10">
                      <DocumentLanguages metadata={currentReferer.metadata} />
                    </Label>
                  </>
                }
              />
            )}
          </Grid.Column>

          <Grid.Column width={3}>
            {relationDescription || (
              <>
                <Icon name="arrows alternate horizontal" />
                <br />
                is a <Label color="blue">related</Label> to
              </>
            )}
          </Grid.Column>

          <Grid.Column width={9} className="scrolling">
            {isEmpty(selections) ? (
              <Message
                info
                icon="info circle"
                header={emptySelectionMessageHeader || 'No relations selected'}
                content="Select a document to proceed."
              />
            ) : (
              renderSelections()
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

RelationSummary.propTypes = {
  selections: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
  currentReferer: PropTypes.object.isRequired,
  // removeFromSelection: PropTypes.func.isRequired,
  renderSelections: PropTypes.func.isRequired,
  emptySelectionMessageHeader: PropTypes.string,
  currentRefererComponent: PropTypes.node,
  relationDescription: PropTypes.node,
};

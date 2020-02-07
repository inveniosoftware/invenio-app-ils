import { DocumentLanguages } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RelationCard } from '../RelationCard';
import isEmpty from 'lodash/isEmpty';
import { Container, Grid, Icon, Label, Message } from 'semantic-ui-react';

export default class RelationSummary extends Component {
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
          <Grid.Column width={this.props.columnsWidths.left}>
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

          <Grid.Column width={this.props.columnsWidths.middle}>
            {relationDescription || (
              <>
                <Icon size="large" name="arrows alternate horizontal" />
                <br />
                is a <Label color="blue">related</Label> to
              </>
            )}
          </Grid.Column>

          <Grid.Column
            width={this.props.columnsWidths.right}
            className="scrolling"
          >
            {isEmpty(selections) ? (
              <Message
                info
                icon="info circle"
                header={emptySelectionMessageHeader || 'No relations selected'}
                content="Select literature to proceed."
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
  selections: PropTypes.array.isRequired,
  currentReferer: PropTypes.object.isRequired,
  // removeFromSelection: PropTypes.func.isRequired,
  renderSelections: PropTypes.func.isRequired,
  emptySelectionMessageHeader: PropTypes.string,
  currentRefererComponent: PropTypes.node,
  relationDescription: PropTypes.node,
  columnsWidths: PropTypes.object,
};

RelationSummary.defaultProps = {
  columnsWidths: { left: 6, middle: 4, right: 6 },
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List } from 'semantic-ui-react';
import { get, isEmpty } from 'lodash';

export class BookAttachments extends Component {
  constructor(props) {
    super(props);
    this.documentData = props.documentData;
    this.displayOption = props.displayOption;
  }

  render() {
    return (
      <>
        <Grid.Row>
          {this.renderAttachments(get(this.documentData, 'files'), 'Files')}
        </Grid.Row>

        <Grid.Row>
          {this.renderAttachments(get(this.documentData, 'links'), 'Links')}
        </Grid.Row>
      </>
    );
  }

  renderAttachments = (attachments, description) => {
    return !isEmpty(attachments) ? (
      <div>
        <Header as="h3">{description}</Header>
        <List>
          {attachments.map((attachment, index) => (
            <List.Item href={attachment} key={`Key${index}`}>
              {attachment}
            </List.Item>
          ))}
        </List>
      </div>
    ) : null;
  };
}

BookAttachments.propTypes = {
  documentData: PropTypes.object.isRequired,
  displayOption: PropTypes.string.isRequired,
};

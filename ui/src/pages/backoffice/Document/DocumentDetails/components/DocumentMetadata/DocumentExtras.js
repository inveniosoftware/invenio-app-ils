import { MetadataTable } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, List, Segment } from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

export class DocumentExtras extends Component {
  renderConferenceInfo = () => {
    const { conference_info } = this.props.document.metadata;
    let rows = [];
    for (const [key, val] of Object.entries(conference_info)) {
      if (Array.isArray(val)) {
        const arrayVals = (
          <List>
            {val.map((entry, idx) => (
              <List.Item key={idx}>
                <List.Content>
                  <List.Header>{entry.scheme}</List.Header>
                  <List.Description>{entry.value}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        );
        rows.push({ name: capitalize(key), value: arrayVals });
      } else {
        rows.push({ name: capitalize(key), value: val });
      }
    }
    return rows;
  };

  render() {
    const { document } = this.props;
    return (
      <Segment>
        {!isEmpty(document.metadata.conference_info) && (
          <>
            <Header>Conference info</Header>
            <MetadataTable rows={this.renderConferenceInfo()} />
          </>
        )}
      </Segment>
    );
  }
}

DocumentExtras.propTypes = {
  document: PropTypes.object.isRequired,
};

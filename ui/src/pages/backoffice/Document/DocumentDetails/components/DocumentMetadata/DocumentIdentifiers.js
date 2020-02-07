import { InfoMessage, MetadataTable } from '@pages/backoffice';
import { groupBy } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

export class DocumentIdentifiers extends Component {
  prepareIdentifiers = () => {
    const document = this.props.document;
    const groupedIDs = groupBy(document.metadata.identifiers, 'scheme');
    let rows = [];
    for (const [scheme, idsList] of Object.entries(groupedIDs)) {
      rows.push({
        name: scheme,
        value: (
          <List bulleted>
            {idsList.map((entry, idx) => (
              <List.Item key={idx}>
                <List.Content>
                  {entry.value} {entry.material && <>({entry.material})</>}
                </List.Content>
              </List.Item>
            ))}
          </List>
        ),
      });
    }
    return rows;
  };

  render() {
    const { document } = this.props;
    return document.metadata.identifiers ? (
      <MetadataTable rows={this.prepareIdentifiers()} />
    ) : (
      <InfoMessage
        header={'No stored identifiers.'}
        content={'Edit document to add identifiers'}
      />
    );
  }
}

DocumentIdentifiers.propTypes = {
  document: PropTypes.object.isRequired,
};

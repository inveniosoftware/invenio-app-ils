import { MetadataTable } from '@pages/backoffice/components';
import { groupBy, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List } from 'semantic-ui-react';

export class DocumentSubjects extends Component {
  render() {
    const { document } = this.props;

    if (!isEmpty(document.metadata.subjects)) {
      const groupedSubjects = groupBy(document.metadata.subjects, 'scheme');
      let rows = [];
      for (const [scheme, idsList] of Object.entries(groupedSubjects)) {
        rows.push({
          name: scheme,
          value: (
            <List bulleted>
              {idsList.map((entry, idx) => (
                <List.Item key={idx}>
                  <List.Content>{entry.value}</List.Content>
                </List.Item>
              ))}
            </List>
          ),
        });
      }
      return <MetadataTable rows={rows} />;
    }
    return null;
  }
}

DocumentSubjects.propTypes = {
  document: PropTypes.object.isRequired,
};

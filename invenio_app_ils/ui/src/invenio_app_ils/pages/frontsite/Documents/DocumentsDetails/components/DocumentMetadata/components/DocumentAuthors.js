import { List } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentAuthors extends Component {
  render() {
    const { metadata, prefix, otherAuthorsDisplay } = this.props;
    const otherAuthors = otherAuthorsDisplay ? otherAuthorsDisplay : 'et al.';
    return (
      <>
        {prefix ? prefix + ' ' : null}
        <List horizontal bulleted className={'document-authors-list'}>
          {metadata
            ? metadata.authors.map((author, index) => (
                <List.Item as="h4" key={`Key${index}`}>
                  {author.full_name}
                </List.Item>
              ))
            : null}
          {metadata && metadata.other_authors ? otherAuthors : null}
        </List>
      </>
    );
  }
}

DocumentAuthors.propTypes = {
  metadata: PropTypes.object.isRequired,
  prefix: PropTypes.string,
  otherAuthorsDisplay: PropTypes.string,
};

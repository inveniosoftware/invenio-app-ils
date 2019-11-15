import { List } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentAuthors extends Component {
  render() {
    const { metadata, prefix, otherAuthorsDisplay, delimiter } = this.props;
    const otherAuthors = otherAuthorsDisplay ? otherAuthorsDisplay : 'et al.';
    return (
      <div className="document-authors-list-wrapper">
        {prefix ? prefix + ' ' : null}
        {metadata && metadata.authors ? (
          <List horizontal className={'document-authors-list'}>
            {metadata.authors.map((author, index) => (
              <List.Item
                as={this.props.listItemAs ? this.props.listItemAs : ''}
                key={`Key${index}`}
              >
                {author.full_name}
                {index !== metadata.authors.length - 1 ? delimiter : null}
              </List.Item>
            ))}
            {metadata && metadata.other_authors ? otherAuthors : null}
          </List>
        ) : null}
      </div>
    );
  }
}

DocumentAuthors.propTypes = {
  metadata: PropTypes.object,
  prefix: PropTypes.string,
  otherAuthorsDisplay: PropTypes.string,
  listItemAs: PropTypes.string,
  delimiter: PropTypes.string.isRequired,
};

DocumentAuthors.defaultProps = {
  delimiter: '; ',
};

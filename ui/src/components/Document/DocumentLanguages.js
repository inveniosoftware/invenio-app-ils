import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export class DocumentLanguages extends Component {
  render() {
    const { metadata, delimiter } = this.props;
    return (
      <>
        {this.props.prefix}
        <List horizontal className={'document-languages-list'}>
          {metadata && !isEmpty(metadata.languages)
            ? metadata.languages.map((language, index) => (
                <List.Item
                  as={this.props.listItemAs ? this.props.listItemAs : ''}
                  key={`Key${index}`}
                >
                  {language.toUpperCase()}
                  {index !== metadata.languages.length - 1 ? delimiter : null}
                </List.Item>
              ))
            : null}
        </List>
      </>
    );
  }
}

DocumentLanguages.propTypes = {
  metadata: PropTypes.object.isRequired,
  prefix: PropTypes.node,
  otherAuthorsDisplay: PropTypes.string,
  listItemAs: PropTypes.string,
  delimiter: PropTypes.string.isRequired,
};

DocumentLanguages.defaultProps = {
  delimiter: ', ',
};

import { List, Popup, Icon } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

class Roles extends Component {
  render() {
    return (
      <>
        <span>{this.props.roles.join(', ')}</span>
        <br />
      </>
    );
  }
}

Roles.propTypes = {
  roles: PropTypes.array.isRequired,
};

class Affiliations extends Component {
  render() {
    return (
      <>
        <span>
          Aff. :{' '}
          {this.props.affiliations
            .map(item => {
              return item.name;
            })
            .join(', ')}
        </span>
      </>
    );
  }
}

Affiliations.propTypes = {
  affiliations: PropTypes.array.isRequired,
};

class AlternativeNames extends Component {
  render() {
    return (
      <>
        <br />
        <span>Alter. names: {this.props.alternative_names.join(', ')}</span>
        <br />
      </>
    );
  }
}

AlternativeNames.propTypes = {
  alternative_names: PropTypes.array.isRequired,
};

class Identifiers extends Component {
  render() {
    return (
      <>
        <span>
          Ids:{' '}
          {this.props.identifiers
            .map(item => {
              return `${item.value} (${item.scheme})`;
            })
            .join(', ')}
        </span>
        <br />
      </>
    );
  }
}

Identifiers.propTypes = {
  identifiers: PropTypes.array.isRequired,
};

class Type extends Component {
  render() {
    return (
      <>
        <span>Type: {this.props.type}</span>;
        <br />
      </>
    );
  }
}

Type.propTypes = {
  type: PropTypes.string.isRequired,
};

export class DocumentAuthors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  renderPopupContent = author => {
    return (
      <>
        {author.full_name}
        <br />
        {author.roles ? <Roles roles={author.roles} /> : null}
        {author.affiliations ? (
          <Affiliations affiliations={author.affiliations} />
        ) : null}
        {this.props.allFields && (
          <>
            {author.alternative_names ? (
              <AlternativeNames alternative_names={author.alternative_names} />
            ) : null}
            {author.identifiers ? (
              <Identifiers identifiers={author.identifiers} />
            ) : null}
            {author.type ? <Type type={author.type} /> : null}
          </>
        )}
      </>
    );
  };

  renderPopup = author => {
    return (
      <>
        {' '}
        <Popup
          content={this.renderPopupContent(author)}
          position="top center"
          flowing
          trigger={<Icon name="info circle" />}
        />
      </>
    );
  };

  toggleExpandedState = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderExpandButton = () => {
    return (
      <>
        {' '}
        <span className="button-show-more" onClick={this.toggleExpandedState}>
          {this.state.expanded ? 'Show less' : 'et al.'}
        </span>
      </>
    );
  };

  render() {
    const {
      metadata,
      prefix,
      otherAuthorsDisplay,
      popupDisplay,
      delimiter,
      authorsLimit,
      scrollLimit,
      expandable,
    } = this.props;
    const otherAuthors = otherAuthorsDisplay ? otherAuthorsDisplay : 'et al.';

    let authors = metadata.authors;
    let scrollableClass;
    if (metadata && metadata.authors) {
      authors = [...metadata.authors];
      scrollableClass =
        metadata.authors.length > scrollLimit && this.state.expanded
          ? 'expanded'
          : '';
      if (authorsLimit && !this.state.expanded) {
        authors = authors.slice(0, authorsLimit);
      }
    }

    return (
      <div className={`document-authors-list-wrapper ${scrollableClass}`}>
        {prefix ? prefix + ' ' : null}
        {metadata && metadata.authors ? (
          <List
            horizontal
            className={'document-authors-list'}
            as={this.props.listItemAs ? this.props.listItemAs : ''}
          >
            {authors.map((author, index) => (
              <>
                <List.Item key={`Key${index}`}>
                  {author.full_name}
                  {popupDisplay &&
                    (!isEmpty(author.roles) || !isEmpty(author.affiliations)) &&
                    this.renderPopup(author)}
                  {index !== authors.length - 1 ? delimiter : null}
                </List.Item>
              </>
            ))}
            {metadata && metadata.other_authors ? otherAuthors : null}
          </List>
        ) : null}

        {metadata &&
          metadata.authors &&
          authorsLimit &&
          authorsLimit < metadata.authors.length &&
          (expandable ? this.renderExpandButton() : ' et al.')}
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
  popupDisplay: PropTypes.bool,
  expandable: PropTypes.bool,
  scrollLimit: PropTypes.number,
  authorsLimit: PropTypes.number,
  allFields: PropTypes.bool,
};

DocumentAuthors.defaultProps = {
  delimiter: '; ',
  scrollLimit: Infinity,
  allFields: false,
};

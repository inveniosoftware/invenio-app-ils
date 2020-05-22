import { List, Popup, Icon } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

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
        {!isEmpty(author.roles) && (
          <>
            <span>{author.roles.toString()}</span>
            <br />
          </>
        )}
        {!isEmpty(author.affiliations) && (
          <>
            <span>
              Aff. :{' '}
              {author.affiliations
                .map(item => {
                  return item.name;
                })
                .toString()}
            </span>
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
          trigger={<Icon name="question circle outline" />}
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
    } = this.props;
    const otherAuthors = otherAuthorsDisplay ? otherAuthorsDisplay : 'et al.';
    let authors = [...metadata.authors];
    if (authorsLimit && !this.state.expanded) {
      authors = authors.slice(0, authorsLimit);
    }
    let classes = 'document-authors-list-wrapper';
    classes =
      metadata.authors.length > 3
        ? classes + ' document-authors-list-height'
        : classes;
    return (
      <div className={classes}>
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

        {authorsLimit &&
          authorsLimit < metadata.authors.length &&
          this.renderExpandButton()}
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

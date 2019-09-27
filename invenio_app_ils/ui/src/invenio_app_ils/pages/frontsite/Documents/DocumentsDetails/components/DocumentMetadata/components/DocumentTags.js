import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '../../../../../../../routes/urls';

export class DocumentTags extends Component {
  renderTags = () => {
    return this.props.tags.map(tag => (
      <Label className={'highlighted'} key={tag.pid}>
        <Link
          to={FrontSiteRoutes.documentsListWithQuery(
            '&sort=mostrecent&order=desc&aggr[0][tags][value]=tags.' + tag.name
          )}
        >
          {tag.name}
        </Link>
      </Label>
    ));
  };

  render() {
    if (this.props.tags && this.props.tags.length > 0) {
      return <>{this.renderTags()}</>;
    }
    return null;
  }
}

DocumentTags.propTypes = {
  tags: PropTypes.array.isRequired,
};

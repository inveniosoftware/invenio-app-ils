import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Divider, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DownloadLink } from './DownloadLink';
import { sessionManager } from '@authentication/services';

export class DocumentLinks extends Component {
  constructor(props) {
    super(props);
    this.linkCount = 0;
  }

  hasMaxLinks = () => {
    return (
      this.linkCount > 0 &&
      this.props.showMaxLinks &&
      this.linkCount > this.props.showMaxLinks
    );
  };

  hasPermissions = eitem => {
    if (!eitem.open_access) {
      return sessionManager.isAuthenticated();
    }
    return eitem.open_access;
  };

  renderReadableList = () => {
    return this.props.dividers ? <p>None.</p> : null;
  };

  renderDownloadLink = (eitem, file) => (
    <List.Item key={file.file_id}>
      <List.Icon name="download" />
      <List.Content>
        Download <DownloadLink eitem={eitem} filename={file.key} />
      </List.Content>
    </List.Item>
  );

  renderDownloadableList = () => {
    return (
      <List>
        {this.props.eitems.hits.map(eitem =>
          eitem.files.map(file => {
            if (this.hasPermissions(eitem)) {
              this.linkCount++;
            }
            const hideLink = !this.hasPermissions(eitem) || this.hasMaxLinks();
            return hideLink ? null : this.renderDownloadLink(eitem, file);
          })
        )}
      </List>
    );
  };

  renderEmptyMessage = () => {
    return (
      <p>
        {sessionManager.isAuthenticated()
          ? 'No files available.'
          : 'Please login to see restricted files.'}
      </p>
    );
  };

  renderShowAll = () => {
    return (
      <Link to={{}} onClick={this.props.onShowAll}>
        Show all {this.linkCount} links
      </Link>
    );
  };

  render() {
    const { dividers } = this.props;
    this.linkCount = 0;
    return (
      <>
        {dividers && <Divider horizontal>Readable online</Divider>}
        {this.renderReadableList()}
        {dividers && <Divider horizontal>Downloadable</Divider>}
        {this.renderDownloadableList()}
        {this.linkCount === 0 && this.renderEmptyMessage()}
        {this.hasMaxLinks() && this.renderShowAll()}
      </>
    );
  }
}

DocumentLinks.propTypes = {
  dividers: PropTypes.bool,
  eitems: PropTypes.object.isRequired,
  showMaxLinks: PropTypes.number,
  onShowAll: PropTypes.func,
};

DocumentLinks.defaultProps = {
  dividers: false,
  onShowAll: () => {},
};

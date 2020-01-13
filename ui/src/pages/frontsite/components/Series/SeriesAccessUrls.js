import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List } from 'semantic-ui-react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import _truncate from 'lodash/truncate';

const AccessUrl = ({ truncate, url }) => {
  const description = url.description || url.value;
  return (
    <a href={url.value}>
      {truncate ? _truncate(description, { length: 35 }) : description}{' '}
      <Icon name={url.open_access ? 'lock open' : 'lock'} />
    </a>
  );
};

export class SeriesAccessUrls extends React.Component {
  render() {
    const urls = get(this.props, 'metadata.access_urls', []);
    return isEmpty(urls) ? (
      <p>There are no access URLs.</p>
    ) : (
      <List bulleted>
        {urls.map((url, index) => (
          <List.Item key={index}>
            <AccessUrl truncate={this.props.truncate} url={url} />
          </List.Item>
        ))}
      </List>
    );
  }
}

SeriesAccessUrls.propTypes = {
  metadata: PropTypes.object,
  truncate: PropTypes.bool,
};

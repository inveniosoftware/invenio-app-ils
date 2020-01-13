import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import _truncate from 'lodash/truncate';

const Url = ({ truncate, url }) => {
  const description = url.description || url.value;
  return (
    <a href={url.value}>
      {truncate ? _truncate(description, { length: 35 }) : description}{' '}
    </a>
  );
};

export class SeriesUrls extends React.Component {
  render() {
    const urls = get(this.props, 'metadata.urls', []);
    return isEmpty(urls) ? (
      <p>There are no URLs.</p>
    ) : (
      <List bulleted>
        {urls.map((url, index) => (
          <List.Item key={index}>
            <Url truncate={this.props.truncate} url={url} />
          </List.Item>
        ))}
      </List>
    );
  }
}

SeriesUrls.propTypes = {
  metadata: PropTypes.object,
  truncate: PropTypes.bool,
};

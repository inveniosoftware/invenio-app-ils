import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '@routes/urls';
import { SeparatedList } from '@components';
import { DocumentEdition } from '@components/Document';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

export class LiteratureRelations extends Component {
  constructor(props) {
    super(props);
    this.relations = props.relations;
  }

  getLinkTo = relation => {
    return relation.pid_type === 'docid'
      ? FrontSiteRoutes.documentDetailsFor(relation.pid_value)
      : FrontSiteRoutes.seriesDetailsFor(relation.pid_value);
  };

  renderMultiparts = () => {
    const relations = _get(this.relations, 'multipart_monograph', []);
    if (!relations.length) {
      return null;
    }

    const cmp = relations.map(rel => {
      const volume = _get(rel, 'volume');
      return (
        <div key={rel.pid_value}>
          This is part of the monograph{' '}
          <Link to={this.getLinkTo(rel)}>
            {rel.record_metadata.title} {volume && `(vol: ${volume})`}
          </Link>
        </div>
      );
    });
    return <List.Item>{cmp}</List.Item>;
  };

  renderSerials = () => {
    const relations = _get(this.relations, 'serial', []);
    if (!relations.length) {
      return null;
    }

    const items = relations.map(rel => {
      const volume = _get(rel, 'volume');
      return (
        <React.Fragment key={rel.pid_value}>
          <Link to={this.getLinkTo(rel)}>
            {rel.record_metadata.title} {volume && `(vol: ${volume})`}
          </Link>
        </React.Fragment>
      );
    });

    return (
      <List.Item>
        <SeparatedList
          items={items}
          prefix={`This is part of the series: `}
          separator={';'}
        />
      </List.Item>
    );
  };

  renderLanguages = () => {
    const relations = _get(this.relations, 'language', []);
    if (!relations.length) {
      return null;
    }

    const items = relations.map(rel => (
      <Link key={rel.pid_value} to={this.getLinkTo(rel)}>
        {rel.record_metadata.languages.join(' ')}
      </Link>
    ));

    return (
      <List.Item>
        <SeparatedList
          items={items}
          prefix={'See other languages: '}
          separator={';'}
        />
      </List.Item>
    );
  };

  renderEditions = () => {
    const relations = _get(this.relations, 'edition', []);
    if (!relations.length) {
      return null;
    }

    const items = relations.map(rel => {
      return (
        <Link key={rel.pid_value} to={this.getLinkTo(rel)}>
          <DocumentEdition metadata={rel.record_metadata} />
        </Link>
      );
    });

    return (
      <List.Item>
        <SeparatedList
          items={items}
          prefix={'See other editions: '}
          separator={';'}
        />
      </List.Item>
    );
  };

  render() {
    if (!_isEmpty(this.relations)) {
      return (
        <>
          <Divider horizontal>Related</Divider>
          <List>
            {this.renderMultiparts()}
            {this.renderSerials()}
            {this.renderLanguages()}
            {this.renderEditions()}
          </List>
        </>
      );
    } else {
      return null;
    }
  }
}

LiteratureRelations.propTypes = {
  relations: PropTypes.object.isRequired,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '@routes/urls';

export class DocumentRelations extends Component {
  constructor(props) {
    super(props);
    this.relations = props.relations;
  }

  renderMultiparts = () => {
    if (this.relations.mutlipart_monograph) {
      return this.relations.multipart_monograph.map(multipart =>
        multipart.volume
          ? `This is volume ${multipart.volume} of `(
              <Link
                key={multipart.pid}
                to={FrontSiteRoutes.seriesDetailsFor(multipart.pid)}
              >
                {multipart.title}
              </Link>
            )
          : `This ${this.props.documentType} is part of the series ${multipart.title}`
      );
    }
  };

  renderSerials = () => {
    if (this.relations.serial) {
      return (
        <p>
          This {this.props.documentType.toLowerCase()} is part of the series:{' '}
          {this.relations.serial.map(serial => (
            <span key={serial.pid}>
              <Link to={FrontSiteRoutes.seriesDetailsFor(serial.pid)}>
                {serial.title}
              </Link>{' '}
              (vol: {serial.volume});
            </span>
          ))}
        </p>
      );
    }
  };

  renderLanguages = () => {
    if (this.relations.language) {
      return (
        <p>
          Read also in other languages:{' '}
          {this.relations.language.map(obj => (
            <Link
              key={obj.pid}
              to={FrontSiteRoutes.documentDetailsFor(obj.pid)}
            >
              {obj.languages.map(lang => lang + ' ')}
              {'; '}
            </Link>
          ))}
        </p>
      );
    }
  };

  renderEditions = () => {
    if (this.relations.edition) {
      return (
        <p>
          See other editions:&nbsp;
          {this.relations.edition.map(edition => (
            <Link
              key={edition.pid}
              to={FrontSiteRoutes.documentDetailsFor(edition.pid)}
            >
              ed. {edition.edition};{' '}
            </Link>
          ))}
        </p>
      );
    }
  };

  render() {
    if (this.relations) {
      return (
        <>
          <Divider horizontal>Related</Divider>
          {this.renderMultiparts()}
          {this.renderSerials()}
          {this.renderLanguages()}
          {this.renderEditions()}
        </>
      );
    } else {
      return null;
    }
  }
}

DocumentRelations.propTypes = {
  relations: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
};

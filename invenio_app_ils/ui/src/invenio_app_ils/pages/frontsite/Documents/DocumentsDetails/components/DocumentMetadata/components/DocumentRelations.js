import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

export class DocumentRelations extends Component {
  constructor(props) {
    super(props);
    this.relations = props.relations;
  }

  // #TODO add links
  renderMultiparts = () => {
    if (this.relations.mutlipart_monograph) {
      return this.relations.multipart_monograph.map(multipart =>
        multipart.volume
          ? 'This is volume' + multipart.volume + 'of' + multipart.title
          : 'This is part of the series:' + multipart.title
      );
    }
  };

  // TODO add links
  renderSerials = () => {
    if (this.relations.serial) {
      return (
        <p>
          This is part of the series:{' '}
          {this.relations.serial.map(serial => (
            <span key={serial.pid}>
              {serial.title} ({serial.volume})
            </span>
          ))}
        </p>
      );
    }
  };

  // TODO add links
  renderLanguages = () => {
    if (this.relations.language) {
      return (
        <p>
          Read also in other languages:
          {this.relations.language.map(obj =>
            obj.languages.map(lang => lang + ', ')
          )}
        </p>
      );
    }
  };

  // TODO add links
  renderEditions = () => {
    if (this.relations.edition) {
      return (
        <p>
          See other editions:&nbsp;
          {this.relations.edition.map(edition => (
            <span>{edition.edition} </span>
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
};

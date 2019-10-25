import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Headline } from './Headline';
import { SectionsWrapper } from './Sections';

export class Home extends Component {
  render() {
    return (
      <>
        <Headline
          renderElement={this.props.headline}
          headlineImage={this.props.headlineImage}
        />
        <SectionsWrapper sections={this.props.sections} />
      </>
    );
  }
}

Home.propTypes = {
  headline: PropTypes.func,
  headlineImage: PropTypes.string,
  sections: PropTypes.func,
};

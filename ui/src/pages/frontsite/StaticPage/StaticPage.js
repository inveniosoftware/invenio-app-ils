import { Error } from '@components';
import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { getStaticPageByRoute } from '@config/uiConfig';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

export default class StaticPage extends Component {
  componentDidMount() {
    const staticPage = getStaticPageByRoute(this.props.match.path);
    const staticPageID = staticPage['apiURL'];
    this.props.fetchStaticPageDetails(staticPageID);
  }

  parseStaticPageContent = () => {
    const { data } = this.props;
    if (!_isEmpty(data)) {
      return (
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      );
    }
    return null;
  };

  render() {
    const { isLoading, error, data } = this.props;

    return (
      <Error boundary error={error}>
        <Container className="spaced">
          <ILSHeaderPlaceholder fluid isLoading={isLoading} image="false">
            <Header as="h1">{data.title}</Header>
          </ILSHeaderPlaceholder>
          <ILSParagraphPlaceholder fluid isLoading={isLoading} linesNumber={30}>
            {this.parseStaticPageContent(data.content)}
          </ILSParagraphPlaceholder>
        </Container>
      </Error>
    );
  }
}

StaticPage.propTypes = {
  fetchStaticPageDetails: PropTypes.func.isRequired,
};

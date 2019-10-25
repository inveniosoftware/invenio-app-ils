import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { TagCloud } from 'react-tagcloud';

export default class SectionTags extends Component {
  data = () => {
    return [
      { value: 'Mathematics', count: 50 },
      { value: 'Repositories', count: 150 },
      { value: 'Black hole', count: 10 },
      { value: 'Evolution', count: 20 },
      { value: 'Higgs boson', count: 40 },
      { value: 'Super-symmetry', count: 35 },
      { value: 'Invenio', count: 110 },
      { value: 'RDM', count: 90 },
      { value: 'OpenData', count: 80 },
      { value: 'Engineering', count: 123 },
      { value: 'Python', count: 77 },
      { value: 'ReactJS', count: 46 },
      { value: 'Blockchain', count: 44 },
      { value: 'GDPR', count: 44 },
    ];
  };

  customRenderer = (tag, size, color) => (
    <span
      className={'secondary'}
      key={tag.value}
      style={{
        // animation: 'blinker 3s linear infinite',
        // animationDelay: `${Math.random() * 2}s`,
        fontSize: `${size / 30}em`,
        margin: '3px',
        padding: '3px',
        display: 'inline-block',
        lineHeight: '1em',
      }}
    >
      {tag.value}
    </span>
  );

  render() {
    return (
      <Container fluid className={'dot-background-container'}>
        <Container
          className={'fs-landing-page-section dot-background'}
          textAlign={'center'}
        >
          <Header
            as={'h2'}
            className={'section-header highlight'}
            textAlign={'center'}
          >
            Popular topics
          </Header>
          <TagCloud
            tags={this.data()}
            maxSize={100}
            minSize={12}
            renderer={this.customRenderer}
          />
        </Container>
      </Container>
    );
  }
}

import React from 'react';
import renderer from 'react-test-renderer';
import DocumentItem from '../DocumentItem';

it('should render correctly', () => {
  const metadata = {
    title: 'Lorem ipsum',
    authors: ['Jack Kerouac', 'Kurt Vonnegut'],
    publishers: ['Penguin', 'Orion'],
    abstracts: ['Dolore ipsum'],
    pid: '12',
    _computed: { eitems: [] },
  };

  const tree = renderer.create(<DocumentItem metadata={metadata} />).toJSON();
  expect(tree).toMatchSnapshot();
});

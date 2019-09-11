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
    eitems: { hits: [], total: 0 },
    circulation: {
      has_items_for_loan: 0,
    },
  };

  const tree = renderer.create(<DocumentItem metadata={metadata} />).toJSON();
  expect(tree).toMatchSnapshot();
});

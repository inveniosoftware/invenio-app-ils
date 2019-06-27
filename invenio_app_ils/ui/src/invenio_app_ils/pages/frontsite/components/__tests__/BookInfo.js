import React from 'react';
import renderer from 'react-test-renderer';
import { BookInfo } from '../BookInfo';

it('should render correctly when there are no publishers', () => {
  const documentMetadata = {
    title: 'Lorem Ipsum',
    authors: ['Isaac Asimov', 'Stanislaw Lem'],
  };
});

it('should render correctly when there are no authors', () => {
  const documentMetadata = {
    title: 'Lorem Ipsum',
    publishers: ['Hachette'],
  };
});

it('should render correctly', () => {
  const documentMetadata = {
    title: 'Lorem Ipsum',
    authors: ['Isaac Asimov', 'Stanislaw Lem'],
    publishers: ['Hachette'],
  };
  const tree = renderer
    .create(<BookInfo documentMetadata={documentMetadata} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

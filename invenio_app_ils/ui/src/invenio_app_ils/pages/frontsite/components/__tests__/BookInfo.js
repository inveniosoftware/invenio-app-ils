import React from 'react';
import renderer from 'react-test-renderer';
import { BookInfo } from '../BookInfo';
import * as testData from '../../../../../../../../tests/data/documents.json';

it('should render correctly when there are no publishers', () => {
  const documentMetadata = {
    ...testData[0],
  };
});

it('should render correctly when there are no authors', () => {
  const documentMetadata = {
    ...testData[0],
  };
});

it('should render correctly', () => {
  const documentMetadata = {
    ...testData[9],
  };
  const tree = renderer
    .create(<BookInfo documentMetadata={documentMetadata} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

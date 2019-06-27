import React from 'react';
import renderer from 'react-test-renderer';
import { ShareButtons } from '../ShareButtons';

it('should render correctly for mobile', () => {
  const type = 'mobile';
  const tree = renderer.create(<ShareButtons type={type} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly for desktop', () => {
  const type = 'desktop';
  const tree = renderer.create(<ShareButtons type={type} />).toJSON();
  expect(tree).toMatchSnapshot();
});

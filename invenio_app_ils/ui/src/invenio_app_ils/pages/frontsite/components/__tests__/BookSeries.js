import React from 'react';
import renderer from 'react-test-renderer';
import { BookSeries } from '../BookSeries';

const mockGoToSeriesList = jest.fn();

it('should render nothing when the book does not contain any series', () => {
  const relations = {};
  const tree = renderer.create(<BookSeries relations={relations} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when the book contains only serials', () => {
  const relations = {
    serial: [
      {
        pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer.create(<BookSeries relations={relations} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when the book contains only multiparts', () => {
  const relations = {
    mutlipart_monograph: [
      {
        pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer.create(<BookSeries relations={relations} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when book contains only both series types', () => {
  const relations = {
    mutlipart_monograph: [
      {
        pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
    serial: [
      {
        pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer.create(<BookSeries relations={relations} />).toJSON();
  expect(tree).toMatchSnapshot();
});

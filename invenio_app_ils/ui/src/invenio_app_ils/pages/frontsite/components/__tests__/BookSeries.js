import React from 'react';
import renderer from 'react-test-renderer';
import { BookSeries } from '../BookSeries';

const mockGoToSeriesList = jest.fn();

it('should render nothing when the book does not contain any series', () => {
  const series = {};
  const tree = renderer
    .create(<BookSeries series={series} goToSeriesList={mockGoToSeriesList} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when the book contains only serials', () => {
  const series = {
    serial: [
      {
        issn: '5463-4523',
        mode_of_issuance: 'SERIAL',
        series_pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer
    .create(<BookSeries series={series} goToSeriesList={mockGoToSeriesList} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when the book contains only multiparts', () => {
  const series = {
    mutlipart: [
      {
        issn: '5463-4523',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        series_pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer
    .create(<BookSeries series={series} goToSeriesList={mockGoToSeriesList} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when book contains only both series types', () => {
  const series = {
    mutlipart: [
      {
        issn: '5463-4523',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        series_pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
    serial: [
      {
        issn: '5463-4523',
        mode_of_issuance: 'SERIAL',
        series_pid: '89',
        title: 'Lorem Ipsum',
        volume: '55',
      },
    ],
  };
  const tree = renderer
    .create(<BookSeries series={series} goToSeriesList={mockGoToSeriesList} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

import React from 'react';
import SeriesListEntry from '../SeriesListEntry';
import * as testData from '@testData/series.json';
import { shallow } from 'enzyme';

it('should render correctly', () => {
  const data = {
    metadata: {
      ...testData[0],
    },
  };

  const component = shallow(<SeriesListEntry metadata={data.metadata} />);
  expect(component).toMatchSnapshot();
});

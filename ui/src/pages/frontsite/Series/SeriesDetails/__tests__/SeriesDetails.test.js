import React from 'react';
import { shallow, mount } from 'enzyme';
import * as testData from '@testData/series.json';

import SeriesDetails from '../SeriesDetails';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../SeriesPanel', () => {
  return {
    SeriesPanel: () => null,
  };
});
jest.mock('../SeriesMetadata', () => {
  return {
    SeriesMetadata: () => null,
  };
});

jest.mock('@pages/frontsite/components/Series', () => {
  return {
    SeriesTags: () => null,
  };
});

describe('SeriesDetailsContainer tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerHistory = {
    listen: () => () => {},
  };
  const routerUrlParams = {
    params: {
      seriesPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <SeriesDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchSeriesDetails={() => {}}
        series={{ metadata: testData[0] }}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch details on mount', () => {
    const mockedFetchSeriesDetails = jest.fn();
    component = mount(
      <BrowserRouter>
        <SeriesDetails
          history={routerHistory}
          match={routerUrlParams}
          fetchSeriesDetails={mockedFetchSeriesDetails}
          series={{ metadata: testData[0] }}
        />
      </BrowserRouter>
    );
    expect(mockedFetchSeriesDetails).toHaveBeenCalledWith(
      routerUrlParams.params.seriesPid
    );
  });
});

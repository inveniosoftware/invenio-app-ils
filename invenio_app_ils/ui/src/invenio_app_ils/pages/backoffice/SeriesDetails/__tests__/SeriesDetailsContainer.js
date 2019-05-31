import React from 'react';
import { shallow, mount } from 'enzyme';
import SeriesDetailsContainer from '../SeriesDetailsContainer';

jest.mock('../../../../common/config');

jest.mock('../components/SeriesDetails', () => {
  return {
    SeriesDetails: () => null,
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
      <SeriesDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchSeriesDetails={() => {}}
        deleteSeries={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchSeriesDetails = jest.fn();
    const mockDeleteSeries = jest.fn();
    component = mount(
      <SeriesDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchSeriesDetails={mockedFetchSeriesDetails}
        deleteSeries={mockDeleteSeries}
      />
    );
    expect(mockedFetchSeriesDetails).toHaveBeenCalledWith(
      routerUrlParams.params.seriesPid
    );
  });
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import SeriesDetails from '../SeriesDetails';

jest.mock('../components/', () => {
  return {
    SeriesDocuments: () => null,
    SeriesMetadata: () => null,
    SeriesMultipartMonographs: () => null,
    SeriesRelations: () => null,
  };
});

describe('SeriesDetails tests', () => {
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
        deleteSeries={() => {}}
        isLoading={false}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchSeriesDetails = jest.fn();
    const mockDeleteSeries = jest.fn();
    const mockisLoading = false;
    component = mount(
      <SeriesDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchSeriesDetails={mockedFetchSeriesDetails}
        deleteSeries={mockDeleteSeries}
        isLoading={mockisLoading}
      />
    );
    expect(mockedFetchSeriesDetails).toHaveBeenCalledWith(
      routerUrlParams.params.seriesPid
    );
  });
});

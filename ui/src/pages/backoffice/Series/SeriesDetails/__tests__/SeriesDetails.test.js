import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SeriesDetails from '../SeriesDetails';
import testData from '@testData/documents.json';
import testSeries from '@testData/series.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../components/', () => {
  return {
    SeriesDocuments: () => null,
    SeriesMetadata: () => null,
    SeriesMetadataTabs: () => null,
    SeriesMultipartMonographs: () => null,
    SeriesRelations: () => null,
    SeriesSiblings: () => null,
    RelationLanguages: () => null,
  };
});

jest.mock('../', () => {
  return {
    SeriesActionMenu: () => null,
    SeriesHeader: () => null,
  };
});

jest.mock('@pages/backoffice/components/Relations/RelationSerial', () => {
  return {
    RelationSerial: () => null,
  };
});

jest.mock('../components/SeriesRelations/RelationLanguages', () => {
  return {
    RelationLanguages: () => null,
    RelationOther: () => null,
  };
});

jest.mock('../components/SeriesRelations/RelationOther', () => {
  return {
    RelationOther: () => null,
  };
});

let store;
beforeEach(() => {
  store = mockStore({
    isLoading: false,
    data: { metadata: testSeries[0] },
    hasError: false,
    seriesDetails: { metadata: testSeries[0] },
    relations: { error: false, data: {} },
    recordRelations: { error: false, data: {} },
  });
  store.clearActions();
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
        isLoading={false}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchSeriesDetails = jest.fn();
    const mockisLoading = false;
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <SeriesDetails
            history={routerHistory}
            match={routerUrlParams}
            fetchSeriesDetails={mockedFetchSeriesDetails}
            isLoading={mockisLoading}
            data={{ metadata: testSeries[0] }}
          />
        </Provider>
      </BrowserRouter>
    );
    expect(mockedFetchSeriesDetails).toHaveBeenCalledWith(
      routerUrlParams.params.seriesPid
    );
  });
});

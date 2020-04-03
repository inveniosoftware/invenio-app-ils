import React from 'react';
import { shallow } from 'enzyme';
import documentsTestData from '@testData/documents.json';
import seriesTestData from '@testData/series.json';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { SeriesLiteratureSearch } from '..';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const series = seriesTestData[0];

const data = {
  hits: {
    total: 4,
    hits: [
      { metadata: documentsTestData[0] },
      { metadata: documentsTestData[1] },
      { metadata: seriesTestData[1] },
      { metadata: seriesTestData[2] },
    ],
  },
};

let store;
beforeEach(() => {
  store = mockStore({
    isLoading: false,
    data: data,
    hasError: false,
    notifications: { notifications: [] },
  });
  store.clearActions();
});

describe('SeriesLiteratureSearch tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const layoutToggleMock = jest.fn();

  it('should load the SeriesLiteratureSearch component', () => {
    const component = shallow(
      <SeriesLiteratureSearch
        metadata={series}
        layoutToggle={layoutToggleMock}
      />
    );
    expect(component).toMatchSnapshot();
  });
});

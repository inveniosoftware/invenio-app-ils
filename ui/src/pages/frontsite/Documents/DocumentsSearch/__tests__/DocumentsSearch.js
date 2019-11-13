import React from 'react';
import { shallow } from 'enzyme';
import * as testData from '../../../../../../../tests/data/documents.json';

import { DocumentsSearch } from '../index';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const data = {
  hits: {
    total: 2,
    hits: [{ metadata: testData[0] }, { metadata: testData[1] }],
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

describe('DocumentsSearch tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const layoutToggleMock = jest.fn();

  it('should load the DocumentsSearch component', () => {
    const component = shallow(
      <DocumentsSearch layoutToggle={layoutToggleMock} />
    );
    expect(component).toMatchSnapshot();
  });
});

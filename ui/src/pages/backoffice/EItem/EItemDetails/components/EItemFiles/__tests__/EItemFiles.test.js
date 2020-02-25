import { eitem as eitemApi, file as fileApi } from '@api';
import testData from '@testData/eitems.json';
import { shallow } from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EItemFiles from '../../EItemFiles/EItemFiles';

const mockedCreateBucket = jest.fn();
const mockedUploadFile = jest.fn();

eitemApi.bucket = mockedCreateBucket;
fileApi.upload = mockedUploadFile;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  eitemDetails: { metadata: testData[2] },
  files: testData[2].files,
  error: {},
  isLoading: false,
});

describe('EItemFiles tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the files component', () => {
    const eitem = testData[2];
    const files = eitem.files;
    const component = shallow(
      <EItemFiles eitemDetails={{ metadata: eitem }} files={files} />
    );
    expect(component).toMatchSnapshot();
  });
});

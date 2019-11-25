import { mount, shallow } from 'enzyme';
import React from 'react';
import EItemFiles from '../EItemFiles';
import testData from '@testData/eitems.json';
import { eitem as eitemApi, file as fileApi } from '@api';
import { uploadFile } from '../../../state/actions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockedCreateBucket = jest.fn();
const mockedUploadFile = jest.fn();

eitemApi.bucket = mockedCreateBucket;
fileApi.upload = mockedUploadFile;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({ eitemDetails: {} });

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

  it('should upload file if eitem has a bucket', () => {
    const eitem = testData[2];
    const files = eitem.files;
    const dispatchUploadFile = (eitemPid, bucket, file) =>
      store.dispatch(uploadFile(eitemPid, bucket, file));
    component = mount(
      <EItemFiles
        eitemDetails={{ metadata: eitem }}
        files={files}
        uploadFile={dispatchUploadFile}
      />
    );

    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });

    component.instance().onSelectFile(file);

    expect(mockedCreateBucket).toHaveBeenCalledTimes(0);
    expect(mockedUploadFile).toHaveBeenCalledWith(
      '5d877356-59b2-4886-9e7f-0ba2cb6a5fd3',
      file
    );
  });

  it('should create a bucket and upload file if eitem has no bucket', () => {
    const eitem = testData[3];
    const dispatchUploadFile = (eitemPid, bucket, file) =>
      store.dispatch(uploadFile(eitemPid, bucket, file));
    component = mount(
      <EItemFiles
        eitemDetails={{ pid: eitem.pid, metadata: eitem }}
        files={[]}
        uploadFile={dispatchUploadFile}
      />
    );

    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });

    component.instance().onSelectFile(file);

    expect(mockedCreateBucket).toHaveBeenCalledWith(eitem.pid);
    expect(mockedUploadFile).toHaveBeenCalledWith(
      '5d877356-59b2-4886-9e7f-0ba2cb6a5fd3',
      file
    );
  });
});

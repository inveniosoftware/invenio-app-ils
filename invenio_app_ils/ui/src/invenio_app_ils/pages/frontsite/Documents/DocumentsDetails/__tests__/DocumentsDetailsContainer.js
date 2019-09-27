import React from 'react';
import { shallow, mount } from 'enzyme';
import * as testData from '../../../../../../../../../tests/data/documents.json';

import DocumentsDetailsContainer from '../DocumentsDetailsContainer';

jest.mock('../components/DocumentPanel', () => {
  return {
    DocumentPanel: () => null,
  };
});
jest.mock('../components/DocumentMetadata', () => {
  return {
    DocumentMetadata: () => null,
  };
});
jest.mock('../components/DocumentCirculation', () => {
  return {
    DocumentCirculation: () => null,
  };
});

describe('DocumentsDetailsContainer tests', () => {
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
      documentPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <DocumentsDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentsDetails={() => {}}
        data={testData[0]}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchDocumentsDetails = jest.fn();
    component = mount(
      <DocumentsDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentsDetails={mockedFetchDocumentsDetails}
        data={testData[0]}
      />
    );
    expect(mockedFetchDocumentsDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import * as testData from '../../../../../../../../../tests/data/documents.json';

import DocumentsDetails from '../DocumentsDetails';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../DocumentPanel', () => {
  return {
    DocumentPanel: () => null,
  };
});
jest.mock('../DocumentMetadata', () => {
  return {
    DocumentMetadata: () => null,
  };
});
jest.mock('../DocumentCirculation', () => {
  return {
    DocumentCirculation: () => null,
  };
});

jest.mock('../DocumentMetadata/components', () => {
  return {
    DocumentTags: () => null,
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
      <DocumentsDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentsDetails={() => {}}
        documentDetails={{ metadata: testData[0] }}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchDocumentsDetails = jest.fn();
    component = mount(
      <BrowserRouter>
        <DocumentsDetails
          history={routerHistory}
          match={routerUrlParams}
          fetchDocumentsDetails={mockedFetchDocumentsDetails}
          documentDetails={{ metadata: testData[0] }}
        />
      </BrowserRouter>
    );
    expect(mockedFetchDocumentsDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});

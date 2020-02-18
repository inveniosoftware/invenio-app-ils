import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DocumentDetails from '../DocumentDetails';
import testData from '@testData/documents.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../components/', () => {
  return {
    DocumentActionMenu: () => null,
    DocumentMetadata: () => null,
    DocumentPendingLoans: () => null,
    DocumentItems: () => null,
    DocumentEItems: () => null,
    DocumentRelations: () => null,
    DocumentStats: () => null,
    DocumentCirculation: () => null,
    DocumentSummary: () => null,
    DocumentSubjects: () => null,
  };
});

jest.mock('../', () => {
  return {
    DocumentHeader: () => null,
    DocumentContent: () => null,
  };
});

jest.mock('../components/DocumentRelations', () => {
  return {
    DocumentSeries: () => null,
    DocumentSiblings: () => null,
    RelationMultipartModal: () => null,
    RelationMultipart: () => null,
    RelationRemover: () => null,
    RelationLanguagesModal: () => null,
    RelationEditionModal: () => null,
    RelationOtherModal: () => null,
    RelationSerialModal: () => null,
  };
});

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
    documentDetails: data,
    documentRelations: { error: false, data: {} },
  });
  store.clearActions();
});

describe('DocumentDetails tests', () => {
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
      <DocumentDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch document details on mount', () => {
    const mockedFetchDocumentDetails = jest.fn();
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <DocumentDetails
            history={routerHistory}
            match={routerUrlParams}
            fetchDocumentDetails={mockedFetchDocumentDetails}
            data={{ metadata: testData[0] }}
          />
        </Provider>
      </BrowserRouter>
    );
    expect(mockedFetchDocumentDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});

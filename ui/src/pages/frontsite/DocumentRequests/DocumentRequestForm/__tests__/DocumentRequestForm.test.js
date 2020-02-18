import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import DocumentRequestForm from '../DocumentRequestForm';
import { documentRequest as documentRequestApi } from '@api';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
beforeEach(() => {
  store = mockStore({
    authenticationManagement: {
      data: { id: '1' },
    },
  });
  store.clearActions();
});

describe('DocumentRequestForm tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should render the document request form correctly', () => {
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <DocumentRequestForm />
        </Provider>
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
  });

  it('should pre-populate the title field from the location state', () => {
    const titleText = 'Hello world!';

    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <DocumentRequestForm
            createDocumentRequest={() => {}}
            location={{
              state: {
                queryString: titleText,
              },
            }}
          />
        </Provider>
      </BrowserRouter>
    );

    const title = component
      .find('DocumentRequestForm')
      .find('FormInput')
      .filterWhere(element => element.prop('name') === 'title');
    expect(title).toHaveLength(1);
    expect(title.prop('value')).toEqual(titleText);
  });

  it('should call create document request on submit', done => {
    const titleText = 'Hello world!';
    const mockedSuccessNotification = jest.fn();
    documentRequestApi.create = values => {
      expect(values.title).toEqual(titleText);
      done();
    };

    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <DocumentRequestForm
            user={{ id: '1' }}
            sendSuccessNotification={mockedSuccessNotification}
            location={{
              state: {
                queryString: titleText,
              },
            }}
          />
        </Provider>
      </BrowserRouter>
    );

    const submitButton = component
      .find('DocumentRequestForm')
      .find('Button')
      .filterWhere(element => element.prop('type') === 'submit');
    expect(submitButton).toHaveLength(1);
    submitButton.simulate('submit');

    expect();
  });
});

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import DocumentRequestForm from '../DocumentRequestForm';
import { documentRequest as documentRequestApi } from '../../../../../common/api';

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
        <DocumentRequestForm />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
  });

  it('should pre-populate the title field from the location state', () => {
    const titleText = 'Hello world!';

    component = mount(
      <BrowserRouter>
        <DocumentRequestForm
          createDocumentRequest={() => {}}
          location={{
            state: {
              queryString: titleText,
            },
          }}
        />
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
        <DocumentRequestForm
          sendSuccessNotification={mockedSuccessNotification}
          location={{
            state: {
              queryString: titleText,
            },
          }}
        />
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

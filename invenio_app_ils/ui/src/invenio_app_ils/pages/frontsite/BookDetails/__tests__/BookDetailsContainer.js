import React from 'react';
import { shallow, mount } from 'enzyme';
import BookDetailsContainer from '../BookDetailsContainer';
jest.mock('../components/BookDetails', () => {
  return {
    BookDetails: () => null,
  };
});

describe('BookDetailsContainer tests', () => {
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
      <BookDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchBookDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchBookDetails = jest.fn();
    component = mount(
      <BookDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchBookDetails={mockedFetchBookDetails}
      />
    );
    expect(mockedFetchBookDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});

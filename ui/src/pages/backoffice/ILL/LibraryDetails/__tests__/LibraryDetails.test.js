import React from 'react';
import { shallow, mount } from 'enzyme';
import LibraryDetails from '../LibraryDetails';

jest.mock('../components/', () => {
  return {
    LibraryMetadata: () => null,
  };
});

describe('LibraryDetails tests', () => {
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
      libraryPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <LibraryDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchLibraryDetails={() => {}}
        deleteLibrary={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch library details on mount', () => {
    const mockedFetchLibraryDetails = jest.fn();
    const mockDeleteLibrary = jest.fn();
    component = mount(
      <LibraryDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchLibraryDetails={mockedFetchLibraryDetails}
        deleteLibrary={mockDeleteLibrary}
      />
    );
    expect(mockedFetchLibraryDetails).toHaveBeenCalledWith(
      routerUrlParams.params.libraryPid
    );
  });
});

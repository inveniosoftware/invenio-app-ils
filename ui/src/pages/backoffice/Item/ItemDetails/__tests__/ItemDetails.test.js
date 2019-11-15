import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemDetails from '../ItemDetails';

jest.mock('../components/', () => {
  return {
    ItemMetadata: () => null,
    ItemPastLoans: () => null,
  };
});

describe('ItemDetails tests', () => {
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
      itemPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <ItemDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchItemDetails={() => {}}
        deleteItem={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchItemDetails = jest.fn();
    component = mount(
      <ItemDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchItemDetails={mockedFetchItemDetails}
        deleteItem={() => {}}
      />
    );
    expect(mockedFetchItemDetails).toHaveBeenCalledWith(
      routerUrlParams.params.itemPid
    );
  });
});

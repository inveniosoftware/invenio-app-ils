import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemDetailsContainer from '../ItemDetailsContainer';

jest.mock('../../../../common/config');

jest.mock('../components/ItemDetails', () => {
  return {
    ItemDetails: () => null,
  };
});

describe('ItemDetailsContainer tests', () => {
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
      <ItemDetailsContainer
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
      <ItemDetailsContainer
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

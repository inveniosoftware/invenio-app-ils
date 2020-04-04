import React from 'react';
import { shallow } from 'enzyme';
import { _SearchDateRange as SearchDateRange } from '../SearchDateRange';

/** _SearchDateRange is the wrapper before we wrap with HOC `withState` */

jest.mock('@components/DatePicker', () => {
  return {
    DatePicker: () => null,
  };
});

const newFilter = ['loans_from_date', '2020-02-02'];
const mockCurrentQueryState = { filters: [] };
const mockUpdateQueryState = jest.fn();

let wrapper;

beforeEach(() => {
  mockUpdateQueryState.mockClear();
});

describe('SearchDateRange tests', () => {
  it('should render the SearchDateRange', () => {
    wrapper = shallow(
      <SearchDateRange
        currentQueryState={mockCurrentQueryState}
        updateQueryState={mockUpdateQueryState}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call the update query with initial filter value', () => {
    wrapper = shallow(
      <SearchDateRange
        currentQueryState={mockCurrentQueryState}
        updateQueryState={mockUpdateQueryState}
      />
    );

    wrapper.instance().onDateChange(newFilter);
    const expected = { filters: [['loans_from_date', '2020-02-02']] };
    const mockFn = wrapper.instance().props.updateQueryState;
    expect(mockFn).toBeCalledWith(expected);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should replace the existing value in loans_from_date', () => {
    mockCurrentQueryState.filters = [['loans_from_date', '2020-02-01']];

    wrapper = shallow(
      <SearchDateRange
        currentQueryState={mockCurrentQueryState}
        updateQueryState={mockUpdateQueryState}
      />
    );
    wrapper.instance().onDateChange(newFilter);
    const expected = {
      filters: [
        ['loans_from_date', '2020-02-01'],
        ['loans_from_date', '2020-02-02'],
      ],
    };
    const mockFn = wrapper.instance().props.updateQueryState;
    expect(mockFn).toBeCalledWith(expected);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should leave the previous filters unaffected and add the new one', () => {
    mockCurrentQueryState.filters = [['loans_to_date', '2020-03-03']];
    wrapper = shallow(
      <SearchDateRange
        currentQueryState={mockCurrentQueryState}
        updateQueryState={mockUpdateQueryState}
      />
    );
    wrapper.instance().onDateChange(newFilter);
    const expected = { filters: [newFilter] };
    const mockFn = wrapper.instance().props.updateQueryState;
    expect(mockFn).toBeCalledWith(expected);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

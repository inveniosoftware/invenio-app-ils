import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import BookGroup from '../BookGroup';
import testData from '´../../../../../../../../../../../tests/data/documents.json';

Settings.defaultZoneName = 'utc';
const mockFetchDataMethod = jest.fn();
const mockResponse = {
  data: {
    hits: [
      {
        id: 1,
        metadata: {
          ...testData[0],
          eitems: { hits: [], total: 0 },
          circulation: { has_items_for_loan: 2 },
        },
      },
      {
        id: 2,
        metadata: {
          ...testData[1],
          eitems: { hits: [], total: 0 },
          circulation: { has_items_for_loan: 2 },
        },
      },
    ],
    total: 2,
  },
};

let component;
beforeEach(() => {
  mockFetchDataMethod.mockClear();
});

afterEach(() => {
  if (component) {
    component.unmount();
  }
});

describe('BookGroup tests', () => {
  it('should load the BookGroup component', () => {
    const component = shallow(
      <BookGroup
        title="Test"
        fetchDataMethod={() => {}}
        fetchDataQuery={''}
        viewAllUrl={''}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should call the fetchDataMethod on mount', () => {
    mockFetchDataMethod.mockResolvedValue(mockResponse);
    component = mount(
      <BrowserRouter>
        <BookGroup
          title="Test"
          fetchDataMethod={mockFetchDataMethod}
          fetchDataQuery={''}
          viewAllUrl={'/test'}
        />
      </BrowserRouter>
    );
    expect(mockFetchDataMethod).toHaveBeenCalled();
  });

  it('should render book cards', () => {
    mockFetchDataMethod.mockResolvedValue(mockResponse);

    component = mount(
      <BrowserRouter>
        <BookGroup
          title="Test"
          fetchDataMethod={mockFetchDataMethod}
          fetchDataQuery={''}
          viewAllUrl={'/test'}
        />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
    component
      .find('BookGroup')
      .setState({ isLoading: false, data: mockResponse.data });

    const cards = component
      .find('BookGroup')
      .find('CardGroup')
      .find('BookCard')
      .find('Card')
      .filterWhere(
        element =>
          element.prop('data-test') === 'docid-1' ||
          element.prop('data-test') === 'docid-2'
      );
    expect(cards).toHaveLength(2);
  });

  it('should render the VIEW ALL link properly', () => {
    mockFetchDataMethod.mockResolvedValue(mockResponse);

    component = mount(
      <BrowserRouter>
        <BookGroup
          title="Test"
          fetchDataMethod={mockFetchDataMethod}
          fetchDataQuery={''}
          viewAllUrl={'/test'}
        />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
    const link = component
      .find('BookGroup')
      .find('Link')
      .find('a');
    expect(link).toHaveLength(1);
    expect(link.text() === 'VIEW ALL');
    expect(link.prop('href') === '/test');
  });
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { FrontSiteRoutes } from '../../../../../../routes/urls';
import MostLoanedBooks from '../MostLoanedBooks';
import history from '../../../../../../history';

Settings.defaultZoneName = 'utc';

describe('MostLoanedBooks tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the most loaned books component', () => {
    const component = shallow(
      <MostLoanedBooks
        data={{ hits: [], total: 0 }}
        fetchMostLoanedBooks={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch most loaned books on mount', () => {
    const mockedFetchMostLoanedBooks = jest.fn();
    component = mount(
      <MostLoanedBooks
        data={{ hits: [], total: 0 }}
        fetchMostLoanedBooks={mockedFetchMostLoanedBooks}
      />
    );
    expect(mockedFetchMostLoanedBooks).toHaveBeenCalled();
  });

  it('should render pending loans', () => {
    const data = {
      hits: [
        {
          metadata: {
            pid: 'doc1',
            title: { title: 'patron_1' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: { title: 'patron_2' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <MostLoanedBooks data={data} fetchMostLoanedBooks={() => {}} />
    );

    expect(component).toMatchSnapshot();
    const cards = component
      .find('MostLoanedBooks')
      .find('CardGroup')
      .find('BookCard')
      .find('Card')
      .filterWhere(
        element =>
          element.prop('data-test') === 'doc1' ||
          element.prop('data-test') === 'doc2'
      );
    expect(cards).toHaveLength(2);
  });

  it('should render the see all button when showing most loaned books', () => {
    const data = {
      hits: [
        {
          metadata: {
            pid: 'doc1',
            title: { title: 'patron_1' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: { title: 'patron_2' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <MostLoanedBooks
        data={data}
        fetchMostLoanedBooks={() => {}}
        maxItemsToDisplay={1}
      />
    );

    expect(component).toMatchSnapshot();
    const button = component
      .find('MostLoanedBooks')
      .find('Button')
      .filterWhere(element => element.prop('content') === 'See All');
    expect(button).toHaveLength(1);
  });

  it('should go to book details when clicking on a book', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          metadata: {
            pid: 'doc1',
            title: { title: 'patron_1' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: { title: 'patron_2' },
            authors: [],
            eitems: { hits: [], total: 0 },
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <MostLoanedBooks
        data={data}
        fetchMostLoanedBooks={() => {}}
        maxItemsToDisplay={1}
      />
    );
    expect(component).toMatchSnapshot();

    const docPid = data.hits[0].metadata.pid;
    const button = component
      .find('MostLoanedBooks')
      .find('CardGroup')
      .find('BookCard')
      .find('Card')
      .filterWhere(element => element.prop('data-test') === 'doc1')
      .find('a');
    button.simulate('click');

    const expectedParam = FrontSiteRoutes.documentDetailsFor(docPid);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});

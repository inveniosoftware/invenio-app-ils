import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { FrontSiteRoutes } from '../../../../../../routes/urls';
import MostRecentBooks from '../MostRecentBooks';
import history from '../../../../../../history';

Settings.defaultZoneName = 'utc';

describe('MostRecentBooks tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the most recent books component', () => {
    const component = shallow(
      <MostRecentBooks
        data={{ hits: [], total: 0 }}
        fetchMostRecentBooks={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch most recent books on mount', () => {
    const mockedFetchMostRecentBooks = jest.fn();
    component = mount(
      <MostRecentBooks
        data={{ hits: [], total: 0 }}
        fetchMostRecentBooks={mockedFetchMostRecentBooks}
      />
    );
    expect(mockedFetchMostRecentBooks).toHaveBeenCalled();
  });

  it('should render pending loans', () => {
    const data = {
      hits: [
        {
          metadata: {
            pid: 'doc1',
            title: 'patron_1',
            authors: [],
            _computed: { eitems: [] },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: 'patron_2',
            authors: [],
            _computed: { eitems: [] },
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <MostRecentBooks data={data} fetchMostRecentBooks={() => {}} />
    );

    expect(component).toMatchSnapshot();
    const cards = component
      .find('MostRecentBooks')
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

  it('should render the see all button when showing most recent books', () => {
    const data = {
      hits: [
        {
          metadata: {
            pid: 'doc1',
            title: 'patron_1',
            authors: [],
            _computed: { eitems: [] },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: 'patron_2',
            authors: [],
            _computed: { eitems: [] },
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <MostRecentBooks
        data={data}
        fetchMostRecentBooks={() => {}}
        maxItemsToDisplay={1}
      />
    );

    expect(component).toMatchSnapshot();
    const button = component
      .find('MostRecentBooks')
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
            title: 'patron_1',
            authors: [],
            _computed: { eitems: [] },
          },
        },
        {
          metadata: {
            pid: 'doc2',
            title: 'patron_2',
            authors: [],
            _computed: { eitems: [] },
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <MostRecentBooks
        data={data}
        fetchMostRecentBooks={() => {}}
        maxItemsToDisplay={1}
      />
    );
    expect(component).toMatchSnapshot();

    const docPid = data.hits[0].metadata.pid;
    const button = component
      .find('MostRecentBooks')
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

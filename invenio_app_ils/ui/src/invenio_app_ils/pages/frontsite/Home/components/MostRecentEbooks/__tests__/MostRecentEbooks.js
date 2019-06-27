import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import { FrontSiteRoutes } from '../../../../../../routes/urls';
import MostRecentEbooks from '../MostRecentEbooks';
import history from '../../../../../../history';

jest.mock('../../../../../../common/config');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('MostRecentEbooks tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const data = {
    hits: [
      {
        metadata: {
          document_pid: '123',
          title: 'Dolore',
          _computed: {
            eitems: [
              {
                document_pid: 'doc1',
                eitem_pid: 'eitem1',
                title: 'title1',
                description: 'Lorem ipsum',
                open_access: true,
                image_size: '',
                image_cover: '',
                onClick: jest.fn(),
              },
            ],
          },
        },
      },
      {
        metadata: {
          document_pid: '456',
          title: 'Ipsum',
          _computed: {
            eitems: [
              {
                document_pid: 'doc2',
                eitem_pid: 'eitem2',
                title: 'title2',
                description: 'Lorem ipsum',
                open_access: false,
                image_size: '',
                image_cover: '',
                onClick: jest.fn(),
              },
            ],
          },
        },
      },
    ],
    total: 2,
  };

  it('should load the most recent ebooks component', () => {
    const component = shallow(
      <MostRecentEbooks
        data={{ hits: [], total: 0 }}
        fetchMostRecentEbooks={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch most recent ebooks on mount', () => {
    const mockedFetchMostRecentEbooks = jest.fn();
    component = mount(
      <MostRecentEbooks
        data={{ hits: [], total: 0 }}
        fetchMostRecentEbooks={mockedFetchMostRecentEbooks}
      />
    );
    expect(mockedFetchMostRecentEbooks).toHaveBeenCalled();
  });

  it('should render pending loans', () => {
    component = mount(
      <MostRecentEbooks data={data} fetchMostRecentEbooks={() => {}} />
    );

    expect(component).toMatchSnapshot();
    const cards = component
      .find('MostRecentEbooks')
      .find('CardGroup')
      .find('EbookCard')
      .find('Card')
      .filterWhere(
        element =>
          element.prop('data-test') === 'eitem1' ||
          element.prop('data-test') === 'eitem2'
      );
    expect(cards).toHaveLength(2);
  });

  it('should render the see all button when showing most recent ebooks', () => {
    component = mount(
      <MostRecentEbooks
        data={data}
        fetchMostRecentEbooks={() => {}}
        maxItemsToDisplay={1}
      />
    );

    expect(component).toMatchSnapshot();
    const button = component
      .find('MostRecentEbooks')
      .find('Button')
      .filterWhere(element => element.prop('content') === 'See All');
    expect(button).toHaveLength(1);
  });

  it('should go to book details when clicking on a book', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;

    component = mount(
      <MostRecentEbooks
        data={data}
        fetchMostRecentEbooks={() => {}}
        maxItemsToDisplay={1}
      />
    );
    expect(component).toMatchSnapshot();

    const docPid = data.hits[0].metadata.document_pid;
    const button = component
      .find('MostRecentEbooks')
      .find('CardGroup')
      .find('EbookCard')
      .find('Card')
      .filterWhere(element => element.prop('data-test') === 'eitem1')
      .find('a');
    button.simulate('click');

    const expectedParam = FrontSiteRoutes.documentDetailsFor(docPid);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import OverbookedDocumentsList from '../OverbookedDocumentsList';
import history from '../../../../../../../history';

jest.mock('../../../../../../../common/config');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('OverbookedDocumentsList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const component = shallow(
      <OverbookedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchOverbookedDocuments={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch documents on mount', () => {
    const mockedFetchLoans = jest.fn();
    component = mount(
      <OverbookedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchOverbookedDocuments={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <OverbookedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchOverbookedDocuments={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render documents', () => {
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          document_pid: 'doc1',
          metadata: {
            title: 'X',
            authors: ['Author1'],
            abstracts: 'This is an abstract',
            circulation: {
              pending_loans: 1,
              has_items_for_loan: 2,
            },
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          document_pid: 'doc2',
          metadata: {
            title: 'X',
            authors: ['Author1'],
            abstracts: 'This is an abstract',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <OverbookedDocumentsList
        data={data}
        fetchOverbookedDocuments={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'doc1' ||
          element.prop('data-test') === 'doc2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should go to loan details when clicking on a document', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          document_pid: 'doc2',
          metadata: {
            title: 'X',
            authors: ['Author1'],
            abstracts: 'This is an abstract',
          },
        },
      ],
      total: 1,
    };

    component = mount(
      <OverbookedDocumentsList
        data={data}
        fetchOverbookedDocuments={() => {}}
        showMaxEntries={1}
      />
    );

    const firstId = data.hits[0].document_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.documentDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});

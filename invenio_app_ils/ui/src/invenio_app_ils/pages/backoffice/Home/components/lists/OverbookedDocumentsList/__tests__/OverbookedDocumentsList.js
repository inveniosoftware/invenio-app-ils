import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import {
  BackOfficeURLS,
  viewLoanDetailsUrl,
} from '../../../../../../../common/urls';
import OverbookedDocumentsList from '../OverbookedDocumentsList';
import { generatePath } from 'react-router-dom';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');

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
        history={() => {}}
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
        history={() => {}}
        data={{ hits: [], total: 0 }}
        fetchOverbookedDocuments={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <OverbookedDocumentsList
        history={() => {}}
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
          ID: 'doc1',
          document_pid: 'doc1',
          updated: d,
          created: d,
          title: 'X',
          circulation: {
            pendingLoans: 1,
            loanableItems: 2,
          },
        },
        {
          ID: 'doc2',
          document_pid: 'doc2',
          updated: d,
          created: d,
          title: 'X',
        },
      ],
      total: 2,
    };

    component = mount(
      <OverbookedDocumentsList
        history={() => {}}
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
    const historyFn = {
      push: mockedHistoryPush,
    };

    const data = {
      hits: [
        {
          ID: 'doc1',
          document_pid: 'doc1',
          updated: d,
          created: d,
          title: 'X',
        },
      ],
      total: 1,
    };

    component = mount(
      <OverbookedDocumentsList
        history={historyFn}
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

    const expectedParam = generatePath(BackOfficeURLS.documentDetails, {
      documentPid: firstId,
    });
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});

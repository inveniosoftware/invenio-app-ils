import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import MostLoanedDocumentsList from '../MostLoanedDocumentsList';
import { fromISO } from '../../../../../common/api/date';
import history from '../../../../../history';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { MemoryRouter } from 'react-router';
import * as testData from '../../../../../../../../../tests/data/documents.json';

jest.mock('../../../components/ExportSearchResults');
jest.mock('../../../../../common/config/invenioConfig');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('MostLoanedDocumentsList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the component', () => {
    const component = shallow(
      <MostLoanedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchMostLoanedDocuments={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch documents on mount', () => {
    const mockedFetchLoans = jest.fn();
    component = mount(
      <MostLoanedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchMostLoanedDocuments={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <MostLoanedDocumentsList
        data={{ hits: [], total: 0 }}
        fetchMostLoanedDocuments={() => {}}
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
          pid: 'doc1',
          metadata: {
            ...testData[0],
            pid: 'doc1',
            loan_count: 1,
            extension_count: 1,
            items: { total: 2 },
            eitems: {total: 2},
            circulation: {
              past_loans_count: 1,
            },
            relations: {

            }
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          pid: 'doc2',
          metadata: {
            ...testData[1],
            pid: 'doc2',
            loan_count: 1,
            extension_count: 1,
            items: { total: 2 },
            eitems: {total: 2},
            circulation: {
              past_loans_count: 1,
            },
            relations: {

            }
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <MemoryRouter>
        <MostLoanedDocumentsList
          data={data}
          fetchMostLoanedDocuments={() => {}}
        />
      </MemoryRouter>
    );

    const rows = component.find('Item');
    expect(rows).toHaveLength(2);
  });

  it('should go to document details when clicking on a document', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'doc1',
          metadata: {
            ...testData[0],
            pid: 'doc1',
            loan_count: 1,
            extension_count: 1,
            items: { total: 2 },
            eitems: {total: 2},
            circulation: {
              past_loans_count: 1,
            },
            relations: {

            }
          },
        },
      ],
      total: 1,
    };

    component = mount(
      <MemoryRouter>
        <MostLoanedDocumentsList
          data={data}
          fetchMostLoanedDocuments={() => {}}
        />
      </MemoryRouter>
    );

    const firstId = data.hits[0].pid;
    const button = component
      .find('Item')
      .find('a')
      .filterWhere(
        element => element.prop('data-test') === `navigate-${firstId}`
      );
    const expectedParam = BackOfficeRoutes.documentDetailsFor(firstId);
    expect(button.props().href).toBe(expectedParam);
  });
});

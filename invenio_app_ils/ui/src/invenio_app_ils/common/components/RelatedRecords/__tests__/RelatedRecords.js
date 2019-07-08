import React from 'react';
import { shallow, mount } from 'enzyme';
import RelatedRecords from '../RelatedRecords';
import { Settings } from 'luxon';
import { fromISO } from '../../../api/date';
import history from '../../../../history';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { Modal } from 'semantic-ui-react';

jest.mock('../../../config');

Settings.defaultZoneName = 'utc';

describe('RelatedRecords tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const doc = {
    document_pid: '111',
    metadata: {
      pid: '111',
      $schema: 'https://127.0.0.1:5000/schemas/documents/document-v1.0.0.json',
      related_records: [],
    },
  };

  it('should load the RelatedRecords component', () => {
    const data = {
      metadata: {
        related_records: [],
      },
    };
    const component = shallow(
      <RelatedRecords
        record={doc}
        data={data}
        fetchRelatedRecords={() => {}}
        SelectorModal={Modal}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no related records', () => {
    const data = {
      metadata: {
        related_records: [],
      },
    };
    component = mount(
      <RelatedRecords
        record={doc}
        data={data}
        fetchRelatedRecords={() => {}}
        SelectorModal={Modal}
      />
    );

    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render related record', () => {
    const data = {
      metadata: {
        related_records: [
          {
            pid: 'docid-1',
            pid_type: 'docid',
            relation_type: 'language',
          },
        ],
      },
    };

    component = mount(
      <RelatedRecords
        record={doc}
        data={data}
        fetchRelatedRecords={() => {}}
        SelectorModal={Modal}
      />
    );

    const rows = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'docid-1');
    expect(rows).toHaveLength(1);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few items', () => {
    const data = {
      metadata: {
        related_records: [
          {
            pid: 'docid-1',
            pid_type: 'docid',
            relation_type: 'edition',
          },
          {
            pid: 'docid-2',
            pid_type: 'docid',
            relation_type: 'edition',
          },
          {
            pid: 'docid-3',
            pid_type: 'docid',
            relation_type: 'language',
          },
          {
            pid: 'docid-4',
            pid_type: 'docid',
            relation_type: 'language',
          },
        ],
      },
    };

    component = mount(
      <RelatedRecords
        record={doc}
        data={data}
        fetchRelatedRecords={() => {}}
        showMaxRelatedRecords={1}
        SelectorModal={Modal}
      />
    );

    const footer = component
      .find('TableFooter')
      .first()
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to record details when clicking on a row', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      metadata: {
        related_records: [
          {
            pid: 'docid-1',
            pid_type: 'docid',
            relation_type: 'language',
          },
        ],
      },
    };

    component = mount(
      <RelatedRecords
        record={doc}
        data={data}
        fetchRelatedRecords={() => {}}
        showMaxRelatedRecords={1}
        SelectorModal={Modal}
      />
    );

    const firstId = data.metadata.related_records[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedUrl = BackOfficeRoutes.documentDetailsFor(firstId);
    const expectedState = { pid: 'docid-1', type: 'Document' };
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedUrl, expectedState);
  });
});

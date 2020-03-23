import React from 'react';
import { fromISO } from '@api/date';
import { mount } from 'enzyme';
import ExtendButton from '../ExtendButton';
import testData from '@testData/loans.json';
import { DateTime } from 'luxon';

jest.mock('@config/invenioConfig');

const end_date = DateTime.local(2032, 12, 13, 12, 13);
const user = {
  id: testData[0].patron_pid,
};

describe('Extend loan button tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should match snapshot', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: end_date,
        extension_count: 0,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should be disabled if the document is overbooked', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: end_date,
        extension_count: 0,
        document: { circulation: { overbooked: true } },
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if patron has reached maximum extensions', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: end_date,
        extension_count: 3,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if extend action is not in available actions', () => {
    const loan = {
      availableActions: {},
      metadata: {
        ...testData[0],
        end_date: end_date,
        extension_count: 0,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );

    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });
});

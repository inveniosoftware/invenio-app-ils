import { fromISO } from '@api/date';
import { orderSerializer as serializer } from '../serializers';

const stringDate = '2018-01-01T11:05:00+01:00';
const price = {
  value: 10.5,
  currency: 'CHF',
};

describe('Order object serialization', () => {
  it('should serialize dates', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      id: 123,
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      links: 'test',
      metadata: {
        pid: '123',
        cancel_reason: 'abc',
        delivery_date: stringDate,
        expected_delivery_date: stringDate,
        funds: ['abc'],
        grand_total: price,
        grand_total_main_currency: price,
        notes: 'abc',
        order_date: stringDate,
        order_lines: [],
        payment: {},
        status: 'RECEIVED',
        vendor_pid: '1',
      },
    });

    expect(serialized).toEqual({
      pid: '123',
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      links: 'test',
      metadata: {
        pid: '123',
        cancel_reason: 'abc',
        delivery_date: fromISO(stringDate),
        expected_delivery_date: fromISO(stringDate),
        funds: ['abc'],
        grand_total: price,
        grand_total_main_currency: price,
        notes: 'abc',
        order_date: fromISO(stringDate),
        order_lines: [],
        payment: {},
        status: 'RECEIVED',
        vendor_pid: '1',
      },
    });
  });
});

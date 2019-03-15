import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Patron loans serialization tests', () => {
  it('should serialize only id and updated if metadata empty', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      availableActions: {},
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {
        start_date: stringDate,
        end_date: stringDate,
        patron_pid: '1',
        document_pid: '2',
        state: 'PENDING',
        transaction_date: stringDate,
        transaction_location_pid: '1',
        request_expire_date: 'd',
        pickup_location_pid: '3',
        transaction_user_pid: '1',
      },
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      start_date: fromISO(stringDate),
      end_date: fromISO(stringDate),
      patron_pid: '1',
      document_pid: '2',
      state: 'PENDING',
      item_pid: '',
      availableActions: {},
      transaction_date: fromISO(stringDate),
      transaction_location_pid: '1',
      request_expire_date: 'd',
      pickup_location_pid: '3',
      transaction_user_pid: '1',
    });
  });

  it('should not serialize start and end dates when not provided', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {
        start_date: stringDate,
        end_date: stringDate,
        patron_pid: '1',
        state: 'PENDING',
        document_pid: '2',
        transaction_date: stringDate,
        transaction_location_pid: '1',
        request_expire_date: 'd',
        pickup_location_pid: '3',
        transaction_user_pid: '1',
      },
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      patron_pid: '1',
      item_pid: '',
      start_date: fromISO(stringDate),
      end_date: fromISO(stringDate),
      document_pid: '2',
      availableActions: {},
      state: 'PENDING',
      transaction_date: fromISO(stringDate),
      transaction_location_pid: '1',
      request_expire_date: 'd',
      pickup_location_pid: '3',
      transaction_user_pid: '1',
    });
  });
});

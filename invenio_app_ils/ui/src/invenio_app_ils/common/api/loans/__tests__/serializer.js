import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Loans serialization tests', () => {
  it('It should serialize the empty loan object', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      availableActions: {},
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {
        loan_pid: '123',
        start_date: stringDate,
        end_date: stringDate,
        patron_pid: '1',
        document_pid: '2',
        state: 'PENDING',
        transaction_date: stringDate,
        transaction_location_pid: '1',
        request_expire_date: stringDate,
        pickup_location_pid: '3',
        transaction_user_pid: '1',
      },
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      availableActions: {},
      metadata: {
        loan_pid: '123',
        start_date: fromISO(stringDate),
        end_date: fromISO(stringDate),
        patron_pid: '1',
        document_pid: '2',
        state: 'PENDING',
        transaction_date: fromISO(stringDate),
        transaction_location_pid: '1',
        request_expire_date: fromISO(stringDate),
        pickup_location_pid: '3',
        transaction_user_pid: '1',
      },
    });
  });
});

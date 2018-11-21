import { serializePendingLoan } from '../selectors';
import { fromBackend } from 'common/api/date';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Pending loans serialization tests', () => {
  it('should serialize only id and updated if metadata empty', () => {
    const serialized = serializePendingLoan({
      id: '123',
      updated: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromBackend(stringDate),
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializePendingLoan({
      id: '123',
      updated: stringDate,
      metadata: {
        patron_pid: '1',
        start_date: stringDate,
        end_date: stringDate,
      },
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromBackend(stringDate),
      patron_pid: '1',
      start_date: fromBackend(stringDate),
      end_date: fromBackend(stringDate),
    });
  });

  it('should not serialize start and end dates when not provided', () => {
    const serialized = serializePendingLoan({
      id: '123',
      updated: stringDate,
      metadata: {
        patron_pid: '1',
      },
    });

    expect(serialized).toEqual({
      loan_pid: '123',
      updated: fromBackend(stringDate),
      patron_pid: '1',
      start_date: null,
      end_date: null,
    });
  });
});

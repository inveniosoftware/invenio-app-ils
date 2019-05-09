import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('EItems serialization tests', () => {
  it('Should serialize eitem attributes, transform date to date object', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {
        eitem_pid: '123',
      },
    });
    expect(serialized).toEqual({
      id: 123,
      eitem_pid: '123',
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
      metadata: {
        eitem_pid: '123',
      },
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {
        eitem_pid: '123',
        description: 'Description',
        internal_notes: 'Internal notes',
        open_access: true,
      },
    });

    expect(serialized).toEqual({
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      eitem_pid: '123',
      metadata: {
        eitem_pid: '123',
        description: 'Description',
        internal_notes: 'Internal notes',
        open_access: true,
      },
    });
  });
});

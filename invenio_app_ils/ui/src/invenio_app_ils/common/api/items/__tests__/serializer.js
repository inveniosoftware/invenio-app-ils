import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Items serialization tests', () => {
  it('Should serialise item attributes, transform date to date object', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {
        item_pid: '123',
      },
    });
    expect(serialized).toEqual({
      id: 123,
      item_pid: '123',
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
      metadata: {
        item_pid: '123',
      },
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {
        item_pid: '123',
        internal_location: { location: { name: 'p' }, name: 'name' },
        circulation_status: { p: 'LOANED' },
        medium: 'p',
        status: 'MISSING',
        shelf: '3 on the left',
        barcode: '111111',
      },
    });

    expect(serialized).toEqual({
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      item_pid: '123',
      metadata: {
        item_pid: '123',
        internal_location: { location: { name: 'p' }, name: 'name' },
        circulation_status: { p: 'LOANED' },
        medium: 'p',
        status: 'MISSING',
        shelf: '3 on the left',
        barcode: '111111',
      },
    });
  });
});

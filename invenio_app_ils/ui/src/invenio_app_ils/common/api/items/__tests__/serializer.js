import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Patron loans serialization tests', () => {
  it('should serialize only id and updated if metadata empty', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {
        item_pid: '123',
        internal_location: {},
      },
    });

    expect(serialized).toEqual({
      item_pid: '123',
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
      location: '',
      legacy_id: '',
      description: '',
      circulation_status: '',
      circulation_restriction: '',
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {
        item_pid: '123',
        internal_location: { location: { name: 'p' }, name: 'name' },
        medium: 'p',
        status: 'MISSING',
        shelf: '3 on the left',
        barcode: '111111',
      },
    });

    expect(serialized).toEqual({
      item_pid: '123',
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      internal_location: 'name',
      medium: 'p',
      status: 'MISSING',
      shelf: '3 on the left',
      barcode: '111111',
      circulation_restriction: '',
      circulation_status: '',
      description: '',
      legacy_id: '',
      location: 'p',
    });
  });
});

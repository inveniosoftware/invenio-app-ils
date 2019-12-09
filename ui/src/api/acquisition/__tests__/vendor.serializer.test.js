import { fromISO } from '@api/date';
import { vendorSerializer as serializer } from '../serializers';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Vendor object serialization', () => {
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
        name: 'My vendor',
        address: 'Address',
        email: 'test@test.ch',
        phone: '12345',
        notes: 'Test',
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
        name: 'My vendor',
        address: 'Address',
        email: 'test@test.ch',
        phone: '12345',
        notes: 'Test',
      },
    });
  });
});

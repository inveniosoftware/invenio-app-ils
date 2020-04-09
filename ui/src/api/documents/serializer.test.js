import { fromISO } from '@api/date';
import { documentSerializer } from './serializer';

const stringDateTime = '2018-01-01T11:05:00+01:00';
const stringDate = '2018-11-22';
const objDate = fromISO(stringDate);

describe('Document object serialization', () => {
  it('should serialize dates from response', () => {
    const serialized = documentSerializer.fromJSON({
      id: 123,
      updated: stringDateTime,
      created: stringDateTime,
      links: 'test',
      metadata: {
        pid: '123',
        authors: ['A', 'B'],
        title: 'p',
        circulation: {
          next_available_date: stringDate,
        },
      },
    });

    expect(serialized).toEqual({
      pid: '123',
      id: 123,
      updated: fromISO(stringDateTime),
      created: fromISO(stringDateTime),
      links: 'test',
      metadata: {
        pid: '123',
        authors: ['A', 'B'],
        title: 'p',
        circulation: {
          next_available_date: objDate,
        },
      },
    });
  });
});

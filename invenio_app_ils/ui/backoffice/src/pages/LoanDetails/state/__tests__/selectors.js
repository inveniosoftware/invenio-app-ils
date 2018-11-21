import { serializeLoanDetails } from '../selectors';

describe('Loan details serialization tests', () => {
  it('should serialize all fields', () => {
    const serialized = serializeLoanDetails({
      links: { actions: { name: 'url' } },
      metadata: { field: '1' },
    });

    expect(serialized).toEqual({
      availableActions: { name: 'url' },
      metadata: { field: '1' },
    });
  });

  it('should return empty object if input is empty', () => {
    const serialized = serializeLoanDetails({});

    expect(serialized).toEqual({});
  });
});

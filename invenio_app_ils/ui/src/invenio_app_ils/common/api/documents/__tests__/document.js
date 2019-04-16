import { document as documentApi } from '../document';

describe('Document query builder tests', () => {
  it('should build query string with overbooked documents', () => {
    const query = documentApi
      .query()
      .overbooked()
      .qs();
    expect(query).toEqual('circulation.overbooked:true');
  });

  it('should build query string pending loans stats', () => {
    const query = documentApi
      .query()
      .withPendingLoans()
      .qs();
    expect(query).toEqual('circulation.pending_loans:>0');
  });

  it('should build query with items available for loan', () => {
    const query = documentApi
      .query()
      .withAvailableItems()
      .qs();
    expect(query).toEqual('circulation.items_available_for_loan:>0');
  });

  it('should build query string with items available for loan and pending loans stats', () => {
    const query = documentApi
      .query()
      .withAvailableItems()
      .withPendingLoans()
      .qs();
    expect(query).toEqual(
      'circulation.items_available_for_loan:>0 AND circulation.pending_loans:>0'
    );
  });
});

describe('Loan list url request test', () => {});

import { document as documentApi } from '../document';

describe('Document query builder tests', () => {
  it('should build the query string for overbooked documents', () => {
    const query = documentApi
      .query()
      .overbooked()
      .qs();
    expect(query).toEqual('circulation.overbooked:true');
  });

  it('should build the query string for the documents with items on loan', () => {
    const query = documentApi
      .query()
      .currentlyOnLoan()
      .qs();
    expect(query).toEqual('circulation.active_loans:>0');
  });

  it('should build the query string for documents with pending loans', () => {
    const query = documentApi
      .query()
      .withPendingLoans()
      .qs();
    expect(query).toEqual('circulation.pending_loans:>0');
  });

  it('should build query for documents with items available for loan', () => {
    const query = documentApi
      .query()
      .withAvailableItems()
      .qs();
    expect(query).toEqual('circulation.has_items_for_loan:>0');
  });

  it('should build the query string for documents with items available for loan and pending loans stats', () => {
    const query = documentApi
      .query()
      .withAvailableItems()
      .withPendingLoans()
      .qs();
    expect(query).toEqual(
      'circulation.has_items_for_loan:>0 AND circulation.pending_loans:>0'
    );
  });

  it('should build the query string for documents with keywords', () => {
    const query = documentApi
      .query()
      .withKeyword({ name: 'keyword1' })
      .withKeyword({ name: 'keyword2' })
      .qs();
    expect(query).toEqual(
      'keywords.name:"keyword1" AND keywords.name:"keyword2"'
    );
  });

  it('should build the query string for documents of a type', () => {
    const query = documentApi
      .query()
      .withDocumentType('BOOK')
      .qs();
    expect(query).toEqual('document_types:"BOOK"');
  });

  it('should build the query string for documents with eitems', () => {
    const query = documentApi
      .query()
      .withEitems()
      .qs();
    expect(query).toEqual('circulation.has_eitems:>0');
  });

  it('should build the query string for documents that belong to a series', () => {
    const query = documentApi
      .query()
      .withSeriesPid('123')
      .qs();
    expect(query).toEqual('series.series_pid:123');
  });

  it('should build the query string for documents that belong to multiple series', () => {
    const query = documentApi
      .query()
      .withSeriesPid(['123', '567'])
      .qs();
    expect(query).toEqual('series.series_pid:(123 OR 567)');
  });
});

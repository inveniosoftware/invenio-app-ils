import { item as itemApi } from '../item';

describe('Loan query builder tests', () => {
  it('should build query string with document PID', () => {
    const query = itemApi
      .query()
      .withDocPid(5)
      .qs();
    expect(query).toEqual('document_pid:5');
  });

  it('should build query string with document PID 5 and pending state', () => {
    const query = itemApi
      .query()
      .withDocPid(5)
      .withStatus('MISSING')
      .qs();
    expect(query).toEqual('document_pid:5 AND status:MISSING');
  });

  it('should build query string with missing status', () => {
    const query = itemApi
      .query()
      .withStatus('MISSING')
      .qs();
    expect(query).toEqual('status:MISSING');
  });

  it('should throw error for empty params', () => {
    expect(() => {
      itemApi
        .query()
        .withDocPid(10)
        .withStatus()
        .qs();
    }).toThrow();
  });
});

describe('Loan list url request test', () => {});

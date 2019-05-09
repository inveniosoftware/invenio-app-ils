import { eitem as eitemApi } from '../eitem';

describe('EItem query builder tests', () => {
  it('should build query string with document PID', () => {
    const query = eitemApi
      .query()
      .withDocPid(5)
      .qs();
    expect(query).toEqual('document_pid:5');
  });

  it('should throw error for empty params', () => {
    expect(() => {
      eitemApi
        .query()
        .withDocPid()
        .qs();
    }).toThrow();
  });
});

describe('Loan list url request test', () => {});

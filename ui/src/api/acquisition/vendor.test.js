import { vendor as vendorApi } from './vendor';

describe('Document query builder tests', () => {
  it('should build the query string with address', () => {
    const query = vendorApi
      .query()
      .withAddress('Address')
      .qs();
    expect(query).toEqual('address:"Address"');
  });

  it('should build the query string with name', () => {
    const query = vendorApi
      .query()
      .withName('Name')
      .qs();
    expect(query).toEqual('name:"Name"');
  });

  it('should build the query string with email', () => {
    const query = vendorApi
      .query()
      .withEmail('email')
      .qs();
    expect(query).toEqual('email:"email"');
  });
});

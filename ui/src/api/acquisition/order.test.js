import { order as orderApi } from './order';

describe('Order query builder tests', () => {
  it('should build the query string with patron', () => {
    const query = orderApi
      .query()
      .withPatron('123')
      .qs();
    expect(query).toEqual('order_lines.patron_pid:123');
  });

  it('should build the query string with recipient', () => {
    const query = orderApi
      .query()
      .withRecipient('PATRON')
      .qs();
    expect(query).toEqual('recipient:PATRON');
  });

  it('should build the query string with vendor', () => {
    const query = orderApi
      .query()
      .withVendor('My vendor')
      .qs();
    expect(query).toEqual('vendor.name:"My vendor"');
  });
});

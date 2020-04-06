import { fromISO } from '@api/date';
import { brwReqSerializer, librarySerializer } from './serializers';

const stringDateTime = '2020-02-23T11:05:00+01:00';

describe('Borrowing Request request/response serializers tests', () => {
  const stringDate = '2020-03-12';
  const objDate = fromISO(stringDate);
  const price = {
    value: 10.5,
    currency: 'CHF',
  };
  const payment = {
    debit_cost: price,
    debit_cost_main_currency: price,
    debit_date: stringDate,
    debit_note: 'Some notes',
    internal_purchase_requisition_id: 'kjh4564h',
    mode: 'Credit Card',
  };
  const extension = {
    notes: 'abc',
    request_date: stringDate,
    status: 'PENDING',
  };

  it('should serialize all fields from response', () => {
    const serialized = brwReqSerializer.fromJSON({
      created: stringDateTime,
      id: 123,
      links: 'test',
      metadata: {
        pid: '123',
        cancel_reason: 'abc',
        created_by: {
          type: 'user_id',
          value: '1',
        },
        document_pid: '1h23-ah34',
        expected_delivery_date: stringDate,
        extension: extension,
        library_pid: 'fsdf-324j',
        loan_end_date: stringDate,
        loan_pid: '3453-5hb43',
        notes: 'abc',
        patron_pid: '3',
        payment: payment,
        received_date: stringDate,
        request_date: stringDate,
        status: 'RECEIVED',
        vendor_pid: '1',
        total: price,
        total_main_currency: price,
        type: 'ELECTRONIC',
      },
      updated: stringDateTime,
    });

    expect(serialized).toEqual({
      pid: '123',
      id: 123,
      updated: fromISO(stringDateTime),
      created: fromISO(stringDateTime),
      links: 'test',
      metadata: {
        pid: '123',
        cancel_reason: 'abc',
        created_by: {
          type: 'user_id',
          value: '1',
        },
        document_pid: '1h23-ah34',
        expected_delivery_date: objDate,
        extension: {
          ...extension,
          request_date: objDate,
        },
        library_pid: 'fsdf-324j',
        loan_end_date: objDate,
        loan_pid: '3453-5hb43',
        notes: 'abc',
        patron_pid: '3',
        payment: {
          ...payment,
          debit_date: objDate,
        },
        received_date: objDate,
        request_date: objDate,
        status: 'RECEIVED',
        vendor_pid: '1',
        total: price,
        total_main_currency: price,
        type: 'ELECTRONIC',
      },
    });
  });

  it('should serialize all fields for the request', () => {
    const serialized = brwReqSerializer.toJSON({
      pid: '123',
      cancel_reason: 'abc',
      created_by: {
        type: 'user_id',
        value: '1',
      },
      document_pid: '1h23-ah34',
      expected_delivery_date: objDate,
      extension: {
        ...extension,
        request_date: objDate,
      },
      library_pid: 'fsdf-324j',
      loan_end_date: objDate,
      loan_pid: '3453-5hb43',
      notes: 'abc',
      patron_pid: '3',
      payment: {
        ...payment,
        debit_date: objDate,
      },
      received_date: objDate,
      request_date: objDate,
      status: 'RECEIVED',
      vendor_pid: '1',
      total: price,
      total_main_currency: price,
      type: 'ELECTRONIC',
    });

    expect(serialized).toEqual({
      pid: '123',
      cancel_reason: 'abc',
      created_by: {
        type: 'user_id',
        value: '1',
      },
      document_pid: '1h23-ah34',
      expected_delivery_date: stringDate,
      extension: {
        ...extension,
        request_date: stringDate,
      },
      library_pid: 'fsdf-324j',
      loan_end_date: stringDate,
      loan_pid: '3453-5hb43',
      notes: 'abc',
      patron_pid: '3',
      payment: {
        ...payment,
        debit_date: stringDate,
      },
      received_date: stringDate,
      request_date: stringDate,
      status: 'RECEIVED',
      vendor_pid: '1',
      total: price,
      total_main_currency: price,
      type: 'ELECTRONIC',
    });
  });
});

describe('Library response serializer tests', () => {
  it('should serialize all fields from response', () => {
    const serialized = librarySerializer.fromJSON({
      id: 123,
      updated: stringDateTime,
      created: stringDateTime,
      links: 'test',
      metadata: {
        pid: '123',
        name: 'External library',
        address: 'Address',
        email: 'test@test.ch',
        phone: '12345',
        notes: 'Test',
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
        name: 'External library',
        address: 'Address',
        email: 'test@test.ch',
        phone: '12345',
        notes: 'Test',
      },
    });
  });
});

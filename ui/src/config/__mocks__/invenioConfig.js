export const invenioConfig = {
  items: {
    canCirculateStates: ['CAN_CIRCULATE'],
  },
  circulation: {
    loanRequestStates: ['PENDING'],
    loanActiveStates: ['ITEM_ON_LOAN'],
    loanCompletedStates: ['ITEM_RETURNED'],
    loanCancelledStates: ['CANCELLED'],
    deliveryMethods: { DELIVERY: '', 'PICK UP': '' },
    requestDuration: 60,
  },
  documentRequests: {
    physicalItemProviders: {
      acq: { name: 'Acquisition', pid_type: 'acqoid' },
      ill: { name: 'InterLibrary', pid_type: 'illbid' },
    },
  },
  orders: {
    defaultCurrency: 'CHF',
    paymentModes: [
      { value: 'CREDIT_CARD', text: 'Credit Card' },
      { value: 'CASH', text: 'Cash' },
    ],
    statuses: [
      { value: 'CANCELLED', text: 'Cancelled' },
      { value: 'RECEIVED', text: 'Received' },
      { value: 'ORDERED', text: 'Ordered' },
      { value: 'PENDING', text: 'Pending' },
    ],
  },
  relationTypes: [
    {
      id: 0,
      name: 'language',
      label: 'Language',
    },
    {
      id: 1,
      name: 'edition',
      label: 'Edition',
    },
    {
      id: 2,
      name: 'multipart_monograph',
      label: 'Multipart monograph',
    },
    {
      id: 3,
      name: 'serial',
      label: 'Serial',
    },
    {
      id: 4,
      name: 'other',
      label: 'Other',
    },
  ],
  vocabularies: {
    document: {
      identifier: {
        scheme: 'series_identifier_scheme',
      },
    },
  },
};

export const invenioConfig = {
  items: {
    canCirculateStatuses: ['CAN_CIRCULATE'],
  },
  circulation: {
    extensionsMaxCount: 3,
    loanRequestStates: ['PENDING'],
    loanActiveStates: ['ITEM_ON_LOAN'],
    loanCompletedStates: ['ITEM_RETURNED', 'CANCELLED'],
    deliveryMethods: { DELIVERY: '', 'PICK UP': '' },
    requestDuration: 60,
    loanWillExpireDays: 7,
  },
  documentRequests: {
    physicalItemProviders: {
      acq: { name: 'Acquisition', pid_type: 'acqoid' },
      ill: { name: 'InterLibrary', pid_type: 'illbid' },
    },
    rejectTypes: {
      userCancel: 'USER_CANCEL',
      inCatalog: 'IN_CATALOG',
      notFound: 'NOT_FOUND',
    },
  },
  acqOrders: {
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
  illBorrowingRequests: {
    orderedValidStatuses: ['PENDING', 'REQUESTED', 'ON_LOAN', 'RETURNED'],
    pendingStatuses: ['PENDING'],
    requestedStatuses: ['REQUESTED'],
    activeStatuses: ['ON_LOAN'],
    completedStatuses: ['CANCELLED', 'RETURNED'],
    statuses: [
      { value: 'CANCELLED', text: 'Cancelled' },
      { value: 'PENDING', text: 'Pending' },
      { value: 'REQUESTED', text: 'Requested' },
      { value: 'ON_LOAN', text: 'On loan' },
      { value: 'RETURNED', text: 'Returned' },
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

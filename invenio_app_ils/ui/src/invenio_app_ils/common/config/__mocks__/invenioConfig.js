export const invenioConfig = {
  documents: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
  },
  eitems: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
  },
  items: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
    canCirculateStates: ['CAN_CIRCULATE'],
  },
  loans: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
  },
  circulation: {
    loanRequestStates: ['PENDING'],
    loanActiveStates: ['ITEM_ON_LOAN'],
    loanCompletedStates: ['ITEM_RETURNED'],
    loanCancelledStates: ['CANCELLED'],
    deliveryMethods: { DELIVERY: '', 'PICK UP': '' },
    requestDuration: 60,
  },
  series: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
  },
  patrons: {
    search: {
      sortBy: {
        values: [],
        onEmptyQuery: '',
      },
      sortOrder: [],
      aggs: [],
    },
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
};

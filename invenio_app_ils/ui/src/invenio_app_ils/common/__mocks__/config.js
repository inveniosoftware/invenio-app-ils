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
    available: {
      status: 'CAN_CIRCULATE',
    },
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
    loanActiveStates: ['ITEM_ON_LOAN'],
    loanCompletedStates: [],
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
};

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
      status: 'LOANABLE',
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
};

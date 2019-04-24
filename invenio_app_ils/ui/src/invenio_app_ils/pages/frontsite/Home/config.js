const maxItemsToDisplay = 8;
const document_type = 'BOOK';

const helperFields = [
  {
    name: 'author',
    field: 'authors.full_name',
    defaultValue: '"Doe, John"',
  },
  {
    name: 'created',
    field: '_created',
  },
];

export default {
  MAX_ITEMS_TO_DISPLAY: maxItemsToDisplay,
  DOCUMENT_TYPE: document_type,
  HELPER_FIELDS: helperFields,
};

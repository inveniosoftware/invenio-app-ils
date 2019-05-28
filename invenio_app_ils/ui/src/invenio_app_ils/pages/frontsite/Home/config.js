const maxItemsToDisplay = 8;
const documentType = 'BOOK';

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
  DOCUMENT_TYPE: documentType,
  HELPER_FIELDS: helperFields,
};

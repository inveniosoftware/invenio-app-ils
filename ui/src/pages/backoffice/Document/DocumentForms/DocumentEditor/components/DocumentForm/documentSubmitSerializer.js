export default (values) => {
  const submitValues = { ...values };
  delete submitValues.circulation;
  delete submitValues.eitems;
  delete submitValues.items;
  delete submitValues.relations;
  delete submitValues._access;

  return submitValues;
};

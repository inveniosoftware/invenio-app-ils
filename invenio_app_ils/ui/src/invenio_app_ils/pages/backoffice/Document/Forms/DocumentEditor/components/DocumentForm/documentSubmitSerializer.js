export default values => {
  const submittingValues = { ...values };

  submittingValues.tag_pids = submittingValues.tags.map(tag => tag.pid);

  delete submittingValues.tags;
  delete submittingValues.circulation;
  delete submittingValues.eitems;
  delete submittingValues.items;
  delete submittingValues.relations;
  delete submittingValues._access;

  console.log('submitting values', submittingValues);

  return submittingValues;
};

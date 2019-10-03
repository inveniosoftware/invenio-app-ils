export default values => {
  const submittingValues = { ...values };
  submittingValues['tag_pids'] = submittingValues['tags'].map(tag => tag.pid);
  delete submittingValues['tags'];
  return submittingValues;
};

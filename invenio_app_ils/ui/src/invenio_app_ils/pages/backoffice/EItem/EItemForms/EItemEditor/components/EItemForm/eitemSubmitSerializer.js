export default values => {
  const submittingValues = { ...values };
  submittingValues['document_pid'] = submittingValues['document']['pid'];
  delete submittingValues['document'];
  return submittingValues;
};

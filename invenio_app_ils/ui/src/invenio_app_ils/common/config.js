const getInvenioConfig = () => {
  const element = document.getElementById('invenio-config');
  const jsonString = element ? element.getAttribute('data-config') : '{}';
  return JSON.parse(jsonString);
};

export const invenioConfig = getInvenioConfig();

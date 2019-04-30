const getInvenioConfig = () => {
  const element = document.getElementById('invenio-config');
  const jsonString = element ? element.getAttribute('data-config') : '{}';
  return JSON.parse(jsonString);
};

export const invenioConfig = getInvenioConfig();

// NOTE: the delay that is used when we fire a request with setTimeOut
// in order to give some time to elastic search to index.
export const ES_DELAY = 3000;

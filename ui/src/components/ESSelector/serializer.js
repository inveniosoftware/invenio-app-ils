export const serializeError = error => ({
  id: 'error',
  key: 'error',
  title: error.toString(),
  description: 'Failed to retrieve search results.',
  extra: '',
});

export const serializeDocument = doc => {
  const {
    pid,
    title,
    edition,
    publication_year: year,
    document_type: docType,
  } = doc.metadata;
  const descriptions = [];
  edition && descriptions.push(`Edition: ${edition}`);
  year && descriptions.push(`Year: ${year}`);
  docType && descriptions.push(`Type: ${docType}`);
  return {
    id: pid,
    key: pid,
    title: title,
    description: descriptions.join(' - '),
    extra: `Document #${pid}`,
    metadata: doc.metadata,
  };
};

export const serializeEItem = eitem => ({
  id: eitem.metadata.pid,
  key: eitem.metadata.pid,
  title: eitem.metadata.document.title,
  description: `Open access: ${eitem.metadata.open_access ? 'Yes' : 'No'}`,
  extra: `EItem #${eitem.metadata.pid}`,
  metadata: eitem.metadata,
});

export const serializeInternalLocation = iloc => ({
  id: iloc.metadata.pid,
  key: iloc.metadata.pid,
  title: iloc.metadata.name,
  description: `Location: ${iloc.metadata.location.name}`,
  extra: `Internal Location #${iloc.metadata.pid}`,
  metadata: iloc.metadata,
});

export const serializeItem = item => ({
  id: item.metadata.pid,
  key: item.metadata.pid,
  title: item.metadata.medium,
  description: `Shelf: ${item.metadata.shelf}`,
  extra: `Item #${item.metadata.pid}`,
  metadata: item.metadata,
});

export const serializeLoan = loan => ({
  id: loan.metadata.pid,
  key: loan.metadata.pid,
  title: loan.metadata.state,
  description: `Document PID: ${loan.metadata.document_pid}`,
  extra: `Loan #${loan.metadata.pid}`,
  metadata: loan.metadata,
});

export const serializeLocation = location => ({
  id: location.metadata.pid,
  key: location.metadata.pid,
  title: location.metadata.name,
  description: `Address: ${location.metadata.address}`,
  extra: `Location #${location.metadata.pid}`,
  metadata: location.metadata,
});

export const serializePatron = patron => ({
  id: patron.metadata.id,
  key: patron.metadata.id,
  title: patron.metadata.email,
  description: `Name: ${patron.metadata.name}`,
  extra: `Patron #${patron.metadata.id}`,
  metadata: patron.metadata,
});

export const serializeSeries = series => {
  const {
    pid,
    title,
    edition,
    publication_year: year,
    mode_of_issuance: moi,
  } = series.metadata;
  const descriptions = [];
  edition && descriptions.push(`Edition: ${edition}`);
  year && descriptions.push(`Year: ${year}`);
  moi && descriptions.push(`Mode of Issuance: ${moi}`);
  return {
    id: pid,
    key: pid,
    title: title,
    description: descriptions.join(' - '),
    extra: `Series #${pid}`,
    metadata: series.metadata,
  };
};

export const serializeLibrary = library => ({
  id: library.metadata.pid,
  key: library.metadata.pid,
  title: library.metadata.name,
});

export const serializeVendor = vendor => ({
  id: vendor.metadata.pid,
  key: vendor.metadata.pid,
  title: vendor.metadata.name,
  description: `Name: ${vendor.metadata.name}`,
  extra: `Vendor #${vendor.metadata.pid}`,
  metadata: vendor.metadata,
});

export const serializeAcqOrder = order => ({
  id: order.metadata.pid,
  key: order.metadata.pid,
  pid: order.metadata.pid,
  title: order.metadata.pid,
  metadata: order.metadata,
  extra: `${order.metadata.grand_total.currency} ${order.metadata.grand_total.value}`,
});

export const serializeBorrowingRequest = request => ({
  id: request.metadata.pid,
  key: request.metadata.pid,
  pid: request.metadata.pid,
  title: request.metadata.pid,
});
